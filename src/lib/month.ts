import { locale } from '../i18n';

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

const nameFormat = new Intl.DateTimeFormat(locale, { month: 'long' });

/** "2026-09" -> "september" / "сентябрь" / "septembrie" (lower case, nominative) */
export function formatMonthName(month: string): string {
  const [year, m] = month.split('-').map(Number);
  return nameFormat.format(new Date(year, m - 1, 1)).toLowerCase();
}

/** "2026-09" -> "September 2026" / "Сентябрь 2026" / "Septembrie 2026" */
export function formatMonth(month: string): string {
  const name = formatMonthName(month);
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${month.slice(0, 4)}`;
}
