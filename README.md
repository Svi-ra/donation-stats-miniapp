# Donation statistics — Telegram Mini App

A read-only dashboard that opens from a Telegram group and shows:

- the **all-time donation total** (never changes with the selected month),
- each donor's amount for the **selected month**, plus that month's total,
- the month's **expenses**,
- an **archive** of earlier months.

Nobody can change data from the app. Data is edited by an admin in the Supabase dashboard.

**Stack:** React + TypeScript + Vite (static frontend), Supabase (Postgres + REST API), Telegram WebApp API.
The frontend talks to Supabase through `@supabase/postgrest-js`, Supabase's official query builder — the app only reads data, so the auth/realtime/storage parts of the full `supabase-js` bundle are left out to keep the download small.

```
src/
  config.ts            currency, locale, request timeout
  api/                 all database queries (donors, donations, expenses)
  hooks/useDashboard   loading, caching, error/retry
  components/          AllTimeTotal, MonthSelector, DonorList, Expenses, Archive, Notice
  lib/                 supabase client, telegram init, number/month formatting
supabase/
  migrations/          schema, views, row level security
  seed.sql             sample data
```

---

## 1. Create the Supabase project

1. Go to <https://supabase.com>, sign in, **New project**. Pick any name, a database password (store it somewhere safe) and the region closest to your users.
2. Open **SQL Editor → New query**, paste the whole of
   [`supabase/migrations/20260930000000_init.sql`](supabase/migrations/20260930000000_init.sql) and press **Run**.
   This creates the tables, the two views and the read-only security policies.
3. (Optional) To try the app with sample data, run [`supabase/seed.sql`](supabase/seed.sql) the same way.
4. Open **Project Settings → API** (or **API Keys**) and copy:
   - the **Project URL**,
   - the **anon** / **publishable** key.

   Do **not** use the `service_role` / secret key anywhere in this project.

If you use the Supabase CLI instead: `supabase link --project-ref <ref>` then `supabase db push`.

## 2. Run locally

Requires Node.js 20+.

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in the two values from step 1:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

```bash
npm run dev
```

Open <http://localhost:5173>. Outside Telegram the app follows your system light/dark setting; inside Telegram it uses Telegram's theme.

Other commands: `npm run typecheck`, `npm run build` (output in `dist/`), `npm run preview`.

## 3. Deploy

The build is plain static files, so any HTTPS static host works (Telegram requires HTTPS).

**GitHub Pages (used by this project):** every push to `main` is built and published by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It can also be started by hand from the repository's **Actions** tab. One-time setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Variables:** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (variables, not secrets — both values are public).

The site is served at `https://<user>.github.io/<repo>/`. Data changes in Supabase appear immediately; a deploy is only needed after code changes.

**Vercel / Netlify / Cloudflare Pages:** import the repository, then set

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

The environment variables are baked in at build time, so redeploy after changing them.
You end up with a URL such as `https://your-app.vercel.app` — that is the Mini App URL used below.

## 4. Configure the Telegram bot / Mini App

1. In Telegram open **@BotFather** → `/newbot` → choose a name and a username (e.g. `our_donations_bot`).
2. Create the Mini App: `/newapp` → select the bot → title, description, a 640×360 picture → when asked for the **Web App URL** send your deployed URL → choose a short name, e.g. `stats`.
   BotFather replies with a direct link: `https://t.me/our_donations_bot/stats`.
3. **Put that link in the group.** Direct Mini App links open the app inside Telegram for every group member. Easiest options:
   - post the link in the group and **pin** the message, or
   - add the bot to the group and send a message with a button (run once; `<TOKEN>` is the bot token from BotFather, `<CHAT_ID>` is the group id):

     ```bash
     curl "https://api.telegram.org/bot<TOKEN>/sendMessage" -H "Content-Type: application/json" -d '{"chat_id": "<CHAT_ID>", "text": "Donation statistics", "reply_markup": {"inline_keyboard": [[{"text": "Open donation statistics", "url": "https://t.me/our_donations_bot/stats"}]]}}'
     ```

     then pin that message. (Use a `url` button with the `t.me` link: Telegram's `web_app` buttons only work in private chats, not in groups.)
4. (Optional) Menu button for the bot's private chat: BotFather → `/setmenubutton` → select the bot → send the deployed URL → button title.

Keep the bot token private; this app does not need it.

## 5. Managing data

All changes are made in the Supabase dashboard — **Table Editor** for single rows, **SQL Editor** for the snippets below. Months are always text in `YYYY-MM` form.

### Insert the initial donors

```sql
insert into public.donors (name, display_order) values
  ('John',  1),
  ('Alex',  2),
  ('Maria', 3);
```

`display_order` controls the order in the app (lowest first).

### Record or update a donor's monthly amount

One row per donor per month holds that donor's **total** for the month. This statement creates the row or overwrites the amount:

```sql
insert into public.monthly_donations (donor_id, month, amount)
select id, '2026-10', 150 from public.donors where name = 'John'
on conflict (donor_id, month) do update set amount = excluded.amount;
```

### Starting a new month

Do nothing. Nothing is reset or deleted: a new month simply has no rows yet, so every donor shows `0` until you add that month's amounts. Earlier months stay in the archive.

### Add an expense

```sql
insert into public.expenses (month, name, amount) values ('2026-10', 'Printing', 25);
```

### Remove a donor from the list

```sql
update public.donors set active = false where name = 'Alex';
```

The donor disappears from current months but still shows in past months where they donated, so old totals keep adding up. (Donors with donation history cannot be deleted outright — that is deliberate.)

## 6. Configuration

[`src/config.ts`](src/config.ts):

- `CURRENCY` — label after every amount (`MDL`).
- `LOCALE` — number grouping and month names (`en-US` → `1,250`, `September 2026`).
- `REQUEST_TIMEOUT_MS` — how long to wait before showing the error/retry screen.

## 7. Security model

- The frontend contains only the public anon key. It is visible to anyone who inspects the app; that is expected and safe.
- Row Level Security is enabled on all three tables with **SELECT-only** policies. There are no insert/update/delete policies, and those privileges are also revoked from the `anon` and `authenticated` roles, so writes through the API are rejected.
- The views use `security_invoker`, so they follow the same rules.
- The Supabase dashboard and the service-role key bypass RLS — that is how the admin edits data. Never put the service-role key in `.env*` files of this project.

To check it yourself (should return a permission error):

```bash
curl -X POST "https://xxxxxxxx.supabase.co/rest/v1/expenses" -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>" -H "Content-Type: application/json" -d '{"month":"2026-10","name":"test","amount":1}'
```

## 8. Behaviour notes

- **All-time total** comes from the `donation_totals` view (summed in the database). The app never downloads the full history.
- **Queries:** on open — total, donors, available months, plus donations and expenses for the current month. Changing month fetches only that month's donations and expenses; months already viewed are kept in memory.
- **Month navigation** is limited to the range between the earliest month with data and the current month, so users cannot wander into empty future months. If a future month does contain data (entered early or by mistake), it becomes reachable.
- The "current month" is taken from the phone's clock.
- A donor with no row for a month is shown as `0`.

## Project documentation

- [CHANGELOG.md](CHANGELOG.md) — what has changed
- [DECISIONS.md](DECISIONS.md) — why things are the way they are
- [ROADMAP.md](ROADMAP.md) — planned work, known issues, ideas
- [SESSION_LOG.md](SESSION_LOG.md) — per-session record of work and testing

## Out of scope (by design)

Accounts, payments, admin UI, user-submitted data, expense categories, analytics. The schema leaves room for an admin interface later (donors / monthly donations / expenses map one-to-one to tables).
