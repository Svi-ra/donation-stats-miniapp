# Roadmap

What is not done yet. Finished work is removed from here and recorded in [CHANGELOG.md](CHANGELOG.md).

The three sections mean different things:

- **Planned** — agreed work that will be done.
- **Known issues** — defects, gaps and things not yet verified.
- **Ideas** — suggestions only; not agreed, may never happen.

## Planned

- [ ] Enter September 2026 amounts and any expenses. The four donors and their August 2026 amounts are in; later figures are waiting on the project owner.

## Known issues

- `supabase/seed.sql` has never been executed against a database, so it is untested.
- Dark theme and Telegram theme colours have not been checked visually during development (only the light theme in a browser).
- The `gh-pages` branch on GitHub is a leftover from the earlier deploy method and is no longer used; it can be deleted.
- Supabase's security advisor flags `public.rls_auto_enable()` as a `SECURITY DEFINER` function callable by anonymous users. It existed in the project before this app's migration and was left untouched; its purpose should be confirmed before changing it.
- The bot token was pasted into a chat on 2026-09-30. It is not in the repository, but revoking it in BotFather (`/revoke`) is the safe option.
- The deploy workflow's actions (`checkout@v4`, `setup-node@v4`, `upload-pages-artifact@v3`) target the deprecated Node.js 20 runtime; they still run, with a warning, and should be bumped.
- Language detection from Telegram has not been checked inside Telegram (only the `?lang=` override and the browser fallback were tested). The Russian and Romanian texts have not been reviewed by a native speaker.
- No automated tests.

## Ideas

- Admin interface for donors, monthly donations and expenses (needs authenticated writes; see D-004, D-005).
- Show the balance (all-time donations minus all-time expenses).
- In-app language switch (today the language can only be forced with `?lang=`).
- Bot menu button pointing at the app for private chats.
- ESLint with the React hooks rules (see D-011).
