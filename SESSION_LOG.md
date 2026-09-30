# Session log

One entry per working session, newest first. An entry records what the session did, what was tested, what was left unfinished and what comes next. Details are not repeated here: changes are in [CHANGELOG.md](CHANGELOG.md), reasons in [DECISIONS.md](DECISIONS.md), open work in [ROADMAP.md](ROADMAP.md).

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
