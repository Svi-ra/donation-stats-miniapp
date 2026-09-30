# Roadmap

What is not done yet. Finished work is removed from here and recorded in [CHANGELOG.md](CHANGELOG.md).

The three sections mean different things:

- **Planned** — agreed work that will be done.
- **Known issues** — defects, gaps and things not yet verified.
- **Ideas** — suggestions only; not agreed, may never happen.

## Planned

- [ ] Enter the real donor list (names in display order) and the amounts and expenses to date. Waiting for the list from the project owner.

## Known issues

- `supabase/seed.sql` has never been executed against a database, so it is untested.
- Dark theme and Telegram theme colours have not been checked visually during development (only the light theme in a browser).
- Deploys are manual (`npm run deploy`); see D-008.
- Supabase's security advisor flags `public.rls_auto_enable()` as a `SECURITY DEFINER` function callable by anonymous users. It existed in the project before this app's migration and was left untouched; its purpose should be confirmed before changing it.
- The bot token was pasted into a chat on 2026-09-30. It is not in the repository, but revoking it in BotFather (`/revoke`) is the safe option.
- No automated tests.

## Ideas

- Admin interface for donors, monthly donations and expenses (needs authenticated writes; see D-004, D-005).
- Show the balance (all-time donations minus all-time expenses).
- Romanian/Russian interface, or follow the user's Telegram language.
- Automatic deploys through GitHub Actions once the `workflow` scope is available.
- Bot menu button pointing at the app for private chats.
- ESLint with the React hooks rules (see D-011).
