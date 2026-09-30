import { useState } from 'react';
import { AllTimeTotal } from './components/AllTimeTotal';
import { Archive } from './components/Archive';
import { DonorList } from './components/DonorList';
import type { DonorAmount } from './components/DonorList';
import { Expenses } from './components/Expenses';
import { MonthSelector } from './components/MonthSelector';
import { Notice } from './components/Notice';
import { useDashboard } from './hooks/useDashboard';
import { t } from './i18n';
import { currentMonth } from './lib/month';
import { isSupabaseConfigured } from './lib/supabase';

function Dashboard() {
  const [today] = useState(currentMonth);
  const [month, setMonth] = useState(today);
  const { overview, monthData, error, retry } = useDashboard(month);

  const selectMonth = (next: string) => {
    setMonth(next);
    window.scrollTo(0, 0);
  };

  if (error) {
    return (
      <>
        <AllTimeTotal total={overview?.allTimeTotal ?? null} />
        <Notice title={t.errorTitle} text={t.errorText} onRetry={retry} />
      </>
    );
  }

  const months = overview?.months ?? [];
  // Navigation stays within the months that have data (plus the current one),
  // so nobody wanders off into empty future months.
  const earliest = months.length ? months[months.length - 1] : today;
  const latest = months.length ? months[0] : today;
  const min = earliest < today ? earliest : today;
  const max = latest > today ? latest : today;

  const amounts = new Map(monthData?.donations.map((d) => [d.donorId, d.amount]));
  // Only donors who gave something in the selected month are listed, in their
  // configured order. That includes deactivated donors, so history adds up.
  const rows: DonorAmount[] | null =
    overview && monthData
      ? overview.donors
          .map((donor) => ({ id: donor.id, name: donor.name, amount: amounts.get(donor.id) ?? 0 }))
          .filter((row) => row.amount > 0)
      : null;
  const monthTotal = monthData ? monthData.donations.reduce((sum, d) => sum + d.amount, 0) : null;

  return (
    <>
      <AllTimeTotal total={overview?.allTimeTotal ?? null} />
      <MonthSelector month={month} today={today} min={min} max={max} onChange={setMonth} />
      <DonorList month={month} rows={rows} total={monthTotal} />
      <Expenses expenses={monthData?.expenses ?? null} />
      <Archive months={months.filter((m) => m !== today)} selected={month} onSelect={selectMonth} />
    </>
  );
}

export function App() {
  return (
    <main className="app">
      {isSupabaseConfigured ? (
        <Dashboard />
      ) : (
        <Notice title={t.notConfiguredTitle} text={t.notConfiguredText} />
      )}
    </main>
  );
}
