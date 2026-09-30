import { CURRENCY, LOCALE } from '../config';

const numberFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 });

/** 1250 -> "1,250" */
export function formatNumber(amount: number): string {
  return numberFormat.format(amount);
}

/** 1250 -> "1,250 MDL" */
export function formatAmount(amount: number): string {
  return `${formatNumber(amount)} ${CURRENCY}`;
}
