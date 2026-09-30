import { db } from '../lib/supabase';

export interface MonthlyDonation {
  donorId: number;
  amount: number;
}

/** Sum of every donation ever recorded, aggregated in the database. */
export async function fetchAllTimeTotal(): Promise<number> {
  const { data, error } = await db.from('donation_totals').select('all_time_total').single();
  if (error) throw error;
  return Number(data.all_time_total) || 0;
}

/** Donation rows for one month ("YYYY-MM"). Donors without a row gave 0. */
export async function fetchMonthlyDonations(month: string): Promise<MonthlyDonation[]> {
  const { data, error } = await db
    .from('monthly_donations')
    .select('donor_id, amount')
    .eq('month', month);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    donorId: Number(row.donor_id),
    amount: Number(row.amount) || 0,
  }));
}

/** Months that have any data, newest first. */
export async function fetchAvailableMonths(): Promise<string[]> {
  const { data, error } = await db
    .from('available_months')
    .select('month')
    .order('month', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => String(row.month));
}
