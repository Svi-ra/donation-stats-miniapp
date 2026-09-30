# Project instructions

Read-only Telegram Mini App for donation statistics: React + TypeScript + Vite frontend, Supabase data layer, hosted on GitHub Pages. Setup and usage are in `README.md`.

## Start of every session

Before changing anything, read `SESSION_LOG.md` (latest entry), `ROADMAP.md` and `DECISIONS.md`. Do not undo an accepted decision or drop unfinished work without the owner's agreement.

## End of every session

Update the documentation that the session actually affected:

| File | Holds | Rule |
| --- | --- | --- |
| `CHANGELOG.md` | Completed changes and fixes | Keep a Changelog format; add under `[Unreleased]`, grouped as Added / Changed / Deprecated / Removed / Fixed / Security. Written for users, not a commit list. |
| `DECISIONS.md` | Technical/product decisions and why | Append `D-0NN` with context, decision, consequences; update the index table. Never delete or renumber; mark old ones `Superseded by D-0NN`. |
| `ROADMAP.md` | Work not done yet | Keep **Planned**, **Known issues** and **Ideas** separate. Remove items when done (they move to the changelog). |
| `SESSION_LOG.md` | Per-session record | New entry on top: Done, Tested, Not tested / unfinished, Next steps. |

- One fact lives in one file; the others link to it.
- Record only what is true of the code as it is now; state plainly what was not tested.
- Keep entries short.

## Commands

- `npm run dev` — local dev server (needs `.env.local`, see `.env.example`)
- `npm run build` — type-check and build; this is the only lint
- Deploy: pushing to `main` publishes the site through `.github/workflows/deploy.yml`

## Constraints

- Never commit secrets: no service-role key, no bot token. Only the Supabase publishable key is used, via `.env.local`.
- Database changes go in a new file under `supabase/migrations/`; users must stay SELECT-only.
- All Supabase queries stay in `src/api/`.
