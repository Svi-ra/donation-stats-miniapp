-- Donation statistics: schema, views and read-only RLS.
-- Run once in Supabase (SQL Editor, or `supabase db push`).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Fixed donor list, independent of any month.
create table public.donors (
  id            bigint generated always as identity primary key,
  name          text        not null check (length(trim(name)) > 0),
  display_order integer     not null default 0,
  active        boolean     not null default true,
  created_at    timestamptz not null default now()
);

-- One row per donor per calendar month ("YYYY-MM").
-- A new month never touches old rows: it simply gets rows of its own.
-- A missing row means the donor gave 0 that month.
create table public.monthly_donations (
  id         bigint generated always as identity primary key,
  donor_id   bigint        not null references public.donors (id) on delete restrict,
  month      text          not null check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  amount     numeric(12,2) not null default 0 check (amount >= 0),
  created_at timestamptz   not null default now(),
  updated_at timestamptz   not null default now(),
  unique (donor_id, month)
);

create index monthly_donations_month_idx on public.monthly_donations (month);

-- Free-text expenses per month (no categories).
create table public.expenses (
  id         bigint generated always as identity primary key,
  month      text          not null check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  name       text          not null check (length(trim(name)) > 0),
  amount     numeric(12,2) not null check (amount >= 0),
  created_at timestamptz   not null default now()
);

create index expenses_month_idx on public.expenses (month);

-- Keep monthly_donations.updated_at current.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger monthly_donations_set_updated_at
  before update on public.monthly_donations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Views (aggregation happens in the database, not in the client)
-- security_invoker => the views obey the caller's RLS, not the owner's.
-- ---------------------------------------------------------------------------

-- Single row: sum of every donation ever recorded.
create view public.donation_totals
with (security_invoker = true) as
select coalesce(sum(amount), 0)::numeric(14,2) as all_time_total
from public.monthly_donations;

-- Every month that has at least one donation or expense row.
create view public.available_months
with (security_invoker = true) as
select month from public.monthly_donations
union
select month from public.expenses;

-- ---------------------------------------------------------------------------
-- Security: everyone may read, nobody may write through the API.
-- Writes are done in the Supabase dashboard / with the service role,
-- both of which bypass RLS.
-- ---------------------------------------------------------------------------

alter table public.donors            enable row level security;
alter table public.monthly_donations enable row level security;
alter table public.expenses          enable row level security;

create policy "Public read donors"
  on public.donors for select to anon, authenticated using (true);

create policy "Public read monthly donations"
  on public.monthly_donations for select to anon, authenticated using (true);

create policy "Public read expenses"
  on public.expenses for select to anon, authenticated using (true);

-- No INSERT/UPDATE/DELETE policies exist, so RLS already rejects writes.
-- Also strip the table privileges themselves as a second layer.
revoke all on public.donors, public.monthly_donations, public.expenses,
              public.donation_totals, public.available_months
  from anon, authenticated;

grant select on public.donors, public.monthly_donations, public.expenses,
                public.donation_totals, public.available_months
  to anon, authenticated;
