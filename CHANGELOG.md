# Changelog

Completed, user-visible changes to this project. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/). Dates are ISO 8601.

Why something was done lives in [DECISIONS.md](DECISIONS.md); what is still to do lives in [ROADMAP.md](ROADMAP.md).

## [Unreleased]

### Added

- Russian and Romanian interface translations alongside English. The language follows the user's Telegram interface language, then the browser language; `?lang=en|ru|ro` in the URL overrides both. Month names and number grouping follow the chosen language.

### Changed

- The monthly donor list shows only donors who gave in the selected month; donors with nothing that month are no longer listed with `0`. A month without donations shows "No donations this month" instead of a list.
- `src/config.ts`: `LOCALE` replaced by `DEFAULT_LANGUAGE` (used when the user's language is not one of the three).

- Deployment: GitHub Actions builds and publishes the site on every push to `main`.

### Removed

- `npm run deploy` and `scripts/deploy.mjs` (publishing through the `gh-pages` branch).

## [1.0.0] - 2026-09-30

First public version, live at <https://svi-ra.github.io/donation-stats-miniapp/>.

### Added

- Read-only dashboard: all-time donation total, per-donor amounts and total for the selected month, monthly expenses with total.
- Month navigation (previous/next, "Back to current month") and a collapsible archive of earlier months.
- Loading placeholders, empty states ("No donors yet", "No donations this month", "No expenses this month") and an error screen with retry; requests time out after 15 s.
- Telegram WebApp integration: `ready()`, `expand()`, header/background colour, theme colours through Telegram's CSS variables, with system light/dark fallback outside Telegram.
- Supabase schema: `donors`, `monthly_donations`, `expenses`, views `donation_totals` and `available_months`.
- Single-place configuration of currency, locale and request timeout (`src/config.ts`).
- Sample seed data (`supabase/seed.sql`) and setup instructions (`README.md`).
- `npm run deploy`: builds and publishes `dist/` to the `gh-pages` branch.

### Security

- Row Level Security with SELECT-only policies on all tables; write privileges revoked from the `anon` and `authenticated` roles; views run as `security_invoker`.
