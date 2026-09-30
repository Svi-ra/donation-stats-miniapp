import { CURRENCY } from '../config';
import { t } from '../i18n';
import { formatNumber } from '../lib/format';

interface Props {
  /** null while loading */
  total: number | null;
}

export function AllTimeTotal({ total }: Props) {
  return (
    <header className="hero">
      <h1 className="hero-label">{t.totalDonations}</h1>
      <p className="hero-amount">
        {total === null ? (
          <span className="skeleton skeleton-hero" aria-label={t.loading} />
        ) : (
          <>
            {formatNumber(total)} <span className="hero-currency">{CURRENCY}</span>
          </>
        )}
      </p>
      <p className="hero-caption">{t.allTime}</p>
    </header>
  );
}
