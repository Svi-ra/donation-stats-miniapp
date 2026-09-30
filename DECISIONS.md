# Decisions

A log of technical and product decisions that shape the project, in the spirit of [Architecture Decision Records](https://adr.github.io/), kept in one file because the project is small.

Rules: entries are numbered and never renumbered or deleted. A decision that no longer holds gets its status changed to `Superseded by D-xxx` and a new entry is added. Status is one of `Accepted`, `Superseded`, `Deprecated`.

| # | Decision | Status |
| --- | --- | --- |
| [D-001](#d-001-months-are-yyyy-mm-text) | Months are `YYYY-MM` text | Accepted |
| [D-002](#d-002-one-row-per-donor-per-month-no-reset) | One row per donor per month, no reset | Accepted |
| [D-003](#d-003-totals-are-aggregated-in-the-database) | Totals are aggregated in the database | Accepted |
| [D-004](#d-004-public-read-only-access-enforced-in-the-database) | Public read-only access enforced in the database | Accepted |
| [D-005](#d-005-postgrest-js-instead-of-supabase-js) | `postgrest-js` instead of `supabase-js` | Accepted |
| [D-006](#d-006-deactivated-donors-stay-visible-in-months-they-donated) | Deactivated donors stay visible in months they donated | Superseded by D-014 |
| [D-007](#d-007-month-navigation-is-bounded) | Month navigation is bounded | Accepted |
| [D-008](#d-008-github-pages-deployed-from-a-local-script) | GitHub Pages deployed from a local script | Superseded by D-012 |
| [D-009](#d-009-no-sample-data-in-the-production-database) | No sample data in the production database | Accepted |
| [D-010](#d-010-the-group-opens-the-app-through-a-direct-tme-link) | The group opens the app through a direct `t.me` link | Accepted |
| [D-011](#d-011-typescript-strict-mode-is-the-only-lint) | TypeScript strict mode is the only lint | Accepted |
| [D-012](#d-012-github-pages-deployed-by-github-actions) | GitHub Pages deployed by GitHub Actions | Accepted |
| [D-013](#d-013-interface-language-follows-telegram-no-i18n-library) | Interface language follows Telegram, no i18n library | Accepted |
| [D-014](#d-014-the-monthly-list-shows-only-donors-who-gave-that-month) | The monthly list shows only donors who gave that month | Accepted |

---

## D-001: Months are `YYYY-MM` text

2026-09-30 · Accepted

**Context:** Data is entered by hand in the Supabase dashboard. A `date` column would need a convention (first of month) that is easy to get wrong.
**Decision:** Store `month` as text, validated by a check constraint (`^[0-9]{4}-(0[1-9]|1[0-2])$`).
**Consequences:** Easy to type and read; sorts correctly as a string; the frontend uses the same strings. Date arithmetic in SQL needs a cast.

## D-002: One row per donor per month, no reset

2026-09-30 · Accepted

**Context:** Monthly counters must appear to start at zero while history is kept.
**Decision:** `monthly_donations` holds one row per `(donor_id, month)` (unique). A missing row means 0. Nothing is ever zeroed or deleted at month change, and no zero rows are created in advance.
**Consequences:** A new month needs no action. The row stores the donor's monthly total, not individual payments, so per-payment history is not available.

## D-003: Totals are aggregated in the database

2026-09-30 · Accepted

**Context:** The all-time total must not depend on the selected month, and the client should not download all history.
**Decision:** Views `donation_totals` (single-row sum) and `available_months`. The month total is summed on the client from the rows already fetched for that month.
**Consequences:** Five small queries on open, two per month change. If the dataset grows, the views can become materialised or functions without changing the frontend.

## D-004: Public read-only access enforced in the database

2026-09-30 · Accepted

**Context:** No accounts; the public key is visible to anyone who inspects the app.
**Decision:** RLS on every table with SELECT-only policies, plus write privileges revoked from `anon` and `authenticated`. Views use `security_invoker`. Data is edited in the Supabase dashboard; there is no admin UI.
**Consequences:** Safe with an exposed key (verified: insert and delete return "permission denied"). An admin UI will need authenticated write policies or an Edge Function.

## D-005: `postgrest-js` instead of `supabase-js`

2026-09-30 · Accepted

**Context:** The app only reads over REST; load time in Telegram's WebView matters.
**Decision:** Use `@supabase/postgrest-js` alone, configured in `src/lib/supabase.ts`.
**Consequences:** Smaller bundle (about 76 kB gzipped in total, mostly React). Auth, realtime and storage are unavailable; adding an admin UI means switching to `supabase-js`, a change confined to that file and `src/api/`.

## D-006: Deactivated donors stay visible in months they donated

2026-09-30 · Superseded by D-014

**Context:** Hiding a donor with `active = false` everywhere would make old month totals disagree with the rows shown.
**Decision:** Show a donor if they are active, or if they have an amount above 0 in the selected month.
**Consequences:** History always adds up. Donors with donations cannot be deleted (`on delete restrict`), only deactivated.

## D-007: Month navigation is bounded

2026-09-30 · Accepted

**Context:** Users should not wander into empty future or pre-history months.
**Decision:** Arrows stop at the earliest month with data and at the current month (from the device clock). A later month becomes reachable only if it contains data.
**Consequences:** With an empty database both arrows are disabled.

## D-008: GitHub Pages deployed from a local script

2026-09-30 · Superseded by D-012

**Context:** The available GitHub login lacks the `workflow` scope, so an Actions workflow cannot be pushed.
**Decision:** `npm run deploy` builds locally (reading `.env.local`) and force-pushes `dist/` to `gh-pages`. Vite uses `base: './'` so the build works under the `/donation-stats-miniapp/` sub-path.
**Consequences:** Deploys are manual and depend on the local `.env.local`. Revisit if the `workflow` scope is granted (see ROADMAP).

## D-009: No sample data in the production database

2026-09-30 · Accepted

**Context:** `supabase/seed.sql` contains invented donors and amounts.
**Decision:** The seed is for local/trial projects only and was not run on the live project.
**Consequences:** The live app shows the empty state until real donors are entered.

## D-010: The group opens the app through a direct `t.me` link

2026-09-30 · Accepted

**Context:** Telegram `web_app` buttons and the bot menu button work only in private chats.
**Decision:** Register the Mini App in BotFather (`/newapp`) and share/pin its `t.me/<bot>/<app>` link in the group.
**Consequences:** No bot server is needed, and the bot token is not used by this project.

## D-011: TypeScript strict mode is the only lint

2026-09-30 · Accepted

**Context:** Minimal dependencies were a requirement.
**Decision:** No ESLint; `tsc` with `strict`, `noUnusedLocals`, `noUnusedParameters` runs as part of `npm run build`.
**Consequences:** No React-hooks lint rules. Reconsider if the codebase grows.

## D-012: GitHub Pages deployed by GitHub Actions

2026-09-30 · Accepted · supersedes D-008

**Context:** The owner granted the `workflow` scope and switched the Pages source to GitHub Actions, removing the reason for the local script.
**Decision:** `.github/workflows/deploy.yml` builds and publishes on every push to `main` (and on manual dispatch). The Supabase URL and publishable key are repository Actions *variables*, since both are public. Vite keeps `base: './'` for the sub-path.
**Consequences:** No local step or `.env.local` needed to deploy; every push to `main` goes live, including documentation-only commits. The local deploy script was removed.

## D-013: Interface language follows Telegram, no i18n library

2026-09-30 · Accepted

**Context:** Group members use Telegram in Russian, Romanian or English. The app has about twenty strings and must stay small.
**Decision:** A single typed dictionary in `src/i18n.ts` for `en`, `ru`, `ro`. The language is chosen once at launch: `?lang=` in the URL, then `Telegram.WebApp.initDataUnsafe.user.language_code`, then the browser language, then `DEFAULT_LANGUAGE` (`en`). Month names and number grouping come from `Intl` for that language. There is no in-app language switch.
**Consequences:** No dependency and about 1 kB added. The Telegram language code is read but never stored or sent anywhere. Donor and expense names are shown as entered in the database, untranslated. Adding a language means adding one dictionary; TypeScript flags missing keys.

## D-014: The monthly list shows only donors who gave that month

2026-09-30 · Accepted · supersedes D-006

**Context:** The first version listed every active donor each month, with `0` for those who had not given. The owner asked for non-donors to be left out.
**Decision:** For the selected month, list only donors whose amount is above 0, in `display_order`. If nobody gave, show the "No donations this month" empty state. A row with amount 0 counts as no donation.
**Consequences:** The list no longer shows who has not given. `donors.active` no longer affects what is displayed and the app no longer reads it (a deactivated donor still appears in months they gave, as under D-006); the column is kept for a future admin interface.
