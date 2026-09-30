import { CURRENCY } from '../config';
import { formatNumber } from '../lib/format';

interface Props {
  /** null while loading */
  total: number | null;
}

export function AllTimeTotal({ total }: Props) {
  return (
    <header className="hero">
      <h1 className="hero-label">Total donations</h1>
      <p className="hero-amount">
        {total === null ? (
          <span className="skeleton skeleton-hero" aria-label="Loading" />
        ) : (
          <>
            {formatNumber(total)} <span className="hero-currency">{CURRENCY}</span>
          </>
        )}
      </p>
      <p className="hero-caption">All time</p>
    </header>
  );
}
