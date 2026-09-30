# Session log

One entry per working session, newest first. An entry records what the session did, what was tested, what was left unfinished and what comes next. Details are not repeated here: changes are in [CHANGELOG.md](CHANGELOG.md), reasons in [DECISIONS.md](DECISIONS.md), open work in [ROADMAP.md](ROADMAP.md).

## 2026-09-30 — Monthly list shows only actual donors

**Done**

- Donors without a donation in the selected month are no longer listed (CHANGELOG Unreleased, D-014).

**Tested**

- `npm run build` passes.
- Local dev server against the live database: August lists the four donors in order with a 700 MDL total; September shows 0 MDL and "No donations this month" with no donor rows; all-time total, expenses, archive and navigation unchanged.

**Not tested / unfinished**

- A month where only some donors gave (no such month exists in the data yet).

## 2026-09-30 — Russian and Romanian interface

**Done**

- Added `ru` and `ro` translations with automatic language selection (CHANGELOG Unreleased, D-013).

**Tested**

- `npm run build` passes.
- Local dev server at phone width against the live database: `?lang=ru` and `?lang=ro` translate every label, the page title, month names and the archive, with no horizontal overflow; without `?lang=` an English browser gets English.

**Not tested / unfinished**

- Detection from Telegram's language inside Telegram; native-speaker review of the texts (see ROADMAP).

**Next steps**

- Open the deployed app in Telegram with Russian and Romanian interface languages.

## 2026-09-30 — First real data

**Done**

- Entered the donors Вася, Виорика, Лия, Марк (display order 1–4) and their August 2026 amounts (100, 200, 200, 200) from a screenshot supplied by the owner. No expenses for August.

**Tested**

- Live site: all-time total 700 MDL; August shows the four amounts and a 700 MDL month total; September shows the four donors at 0.

**Next steps**

- September 2026 amounts and expenses (see ROADMAP).

## 2026-09-30 — Switch deployment to GitHub Actions

**Done**

- Replaced the local deploy script with a GitHub Actions workflow (CHANGELOG Unreleased, D-012).
- Stored the Supabase URL and publishable key as repository Actions variables.

**Tested**

- The workflow run for the push completed and the live site loads data from Supabase afterwards.

**Not tested / unfinished**

- The unused `gh-pages` branch is still on GitHub.

**Next steps**

- Unchanged: enter the real donor data; check the dark theme in Telegram.

## 2026-09-30 — Initial build, publish and deploy

**Done**

- Built the app from an empty folder and released 1.0.0 (see CHANGELOG).
- Published the public repository <https://github.com/Svi-ra/donation-stats-miniapp>.
- Applied the schema migration to the Supabase project `nendkrznilgoxytqoxnm`.
- Deployed to GitHub Pages: <https://svi-ra.github.io/donation-stats-miniapp/>.
- Bot `@youthchisinau_donations_bot` created by the project owner, who reports it tested in Telegram.
- Added the project documentation set (this file, CHANGELOG, DECISIONS, ROADMAP) and `CLAUDE.md`.

**Tested**

- `npm run build` (type-check and production build) passes.
- UI at phone width against a local stand-in API with seed-like data: totals, zero-amount donors, month arrows, archive, empty expenses, error screen and retry.
- Live Supabase API with the publishable key: all five reads return 200; insert and delete are rejected with "permission denied".
- Live site loads with no console errors and shows the empty state.

**Not tested / unfinished**

- The live database contains no data.
- See "Known issues" in ROADMAP for the untested seed file and themes.

**Next steps**

1. Get the donor list and figures from the owner and enter them.
2. Confirm the look in Telegram's dark theme on a phone.
