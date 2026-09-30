-- Sample data for trying the app out. Safe to run more than once.
-- Replace the names and amounts with your own, or delete this data later with:
--   truncate public.expenses, public.monthly_donations, public.donors restart identity;

insert into public.donors (name, display_order)
select v.name, v.display_order
from (values
  ('John',  1),
  ('Alex',  2),
  ('Maria', 3),
  ('David', 4)
) as v (name, display_order)
where not exists (select 1 from public.donors d where d.name = v.name);

insert into public.monthly_donations (donor_id, month, amount)
select d.id, v.month, v.amount
from (values
  ('John',  '2026-07', 100),
  ('Alex',  '2026-07',  50),
  ('Maria', '2026-07', 120),
  ('John',  '2026-08', 150),
  ('Alex',  '2026-08', 100),
  ('Maria', '2026-08', 180),
  ('David', '2026-08',  60),
  ('John',  '2026-09', 150),
  ('Alex',  '2026-09',  80),
  ('Maria', '2026-09', 200)
) as v (name, month, amount)
join public.donors d on d.name = v.name
on conflict (donor_id, month) do update set amount = excluded.amount;

insert into public.expenses (month, name, amount)
select v.month, v.name, v.amount
from (values
  ('2026-08', 'Hall rental', 90),
  ('2026-09', 'Printing',    25),
  ('2026-09', 'Transport',   40),
  ('2026-09', 'Equipment',  100)
) as v (month, name, amount)
where not exists (
  select 1 from public.expenses e where e.month = v.month and e.name = v.name
);
