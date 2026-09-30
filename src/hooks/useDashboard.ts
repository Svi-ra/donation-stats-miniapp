import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAllTimeTotal, fetchAvailableMonths, fetchMonthlyDonations } from '../api/donations';
import type { MonthlyDonation } from '../api/donations';
import { fetchDonors } from '../api/donors';
import type { Donor } from '../api/donors';
import { fetchExpenses } from '../api/expenses';
import type { Expense } from '../api/expenses';

/** Data that does not depend on the selected month. */
export interface Overview {
  allTimeTotal: number;
  donors: Donor[];
  months: string[];
}

export interface MonthData {
  donations: MonthlyDonation[];
  expenses: Expense[];
}

async function loadOverview(): Promise<Overview> {
  const [allTimeTotal, donors, months] = await Promise.all([
    fetchAllTimeTotal(),
    fetchDonors(),
    fetchAvailableMonths(),
  ]);
  return { allTimeTotal, donors, months };
}

async function loadMonth(month: string): Promise<MonthData> {
  const [donations, expenses] = await Promise.all([
    fetchMonthlyDonations(month),
    fetchExpenses(month),
  ]);
  return { donations, expenses };
}

export function useDashboard(month: string) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loaded, setLoaded] = useState<{ month: string; data: MonthData } | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Months already fetched this session: going back to one is instant.
  const cache = useRef(new Map<string, MonthData>());

  useEffect(() => {
    let stale = false;
    loadOverview()
      .then((data) => {
        if (!stale) setOverview(data);
      })
      .catch(() => {
        if (!stale) setError(true);
      });
    return () => {
      stale = true;
    };
  }, [attempt]);

  useEffect(() => {
    const cached = cache.current.get(month);
    if (cached) {
      setLoaded({ month, data: cached });
      return;
    }
    let stale = false;
    loadMonth(month)
      .then((data) => {
        cache.current.set(month, data);
        if (!stale) setLoaded({ month, data });
      })
      .catch(() => {
        if (!stale) setError(true);
      });
    return () => {
      stale = true;
    };
  }, [month, attempt]);

  const retry = useCallback(() => {
    setError(false);
    setAttempt((n) => n + 1);
  }, []);

  return {
    overview,
    // null while the selected month is still loading
    monthData: loaded?.month === month ? loaded.data : null,
    error,
    retry,
  };
}
