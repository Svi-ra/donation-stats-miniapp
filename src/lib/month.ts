import { LOCALE } from '../config';

// Months are "YYYY-MM" strings everywhere (same as the database),
// so plain string comparison orders them correctly.

function toKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

export function currentMonth(): string {
  const now = new Date();
  return toKey(now.getFullYear(), now.getMonth());
}

export function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split('-').map(Number);
  const date = new Date(year, m - 1 + delta, 1);
  return toKey(date.getFullYear(), date.getMonth());
}

const longFormat = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });
const nameFormat = new Intl.DateTimeFormat(LOCALE, { month: 'long' });

function toDate(month: string): Date {
  const [year, m] = month.split('-').map(Number);
  return new Date(year, m - 1, 1);
}

/** "2026-09" -> "September 2026" */
export function formatMonth(month: string): string {
  return longFormat.format(toDate(month));
}

/** "2026-09" -> "September" */
export function formatMonthName(month: string): string {
  return nameFormat.format(toDate(month));
}
