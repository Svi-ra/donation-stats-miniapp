import { CURRENCY } from '../config';
import { locale } from '../i18n';

const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });

/** 1250 -> "1,250" (grouping follows the interface language) */
export function formatNumber(amount: number): string {
  return numberFormat.format(amount);
}

/** 1250 -> "1,250 MDL" */
export function formatAmount(amount: number): string {
  return `${formatNumber(amount)} ${CURRENCY}`;
}
