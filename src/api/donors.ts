import { db } from '../lib/supabase';

export interface Donor {
  id: number;
  name: string;
}

/** The full donor list in its manually configured order. */
export async function fetchDonors(): Promise<Donor[]> {
  const { data, error } = await db
    .from('donors')
    .select('id, name')
    .order('display_order')
    .order('name');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
  }));
}
