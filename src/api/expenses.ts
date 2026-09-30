import { db } from '../lib/supabase';

export interface Expense {
  id: number;
  name: string;
  amount: number;
}

/** Expenses for one month ("YYYY-MM"), in the order they were entered. */
export async function fetchExpenses(month: string): Promise<Expense[]> {
  const { data, error } = await db
    .from('expenses')
    .select('id, name, amount')
    .eq('month', month)
    .order('created_at')
    .order('id');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    amount: Number(row.amount) || 0,
  }));
}
