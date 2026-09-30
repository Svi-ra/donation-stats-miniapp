import { t } from '../i18n';
import { formatAmount } from '../lib/format';
import { formatMonthName } from '../lib/month';

export interface DonorAmount {
  id: number;
  name: string;
  amount: number;
}

interface Props {
  month: string;
  /** Donors who gave in this month; null while loading */
  rows: DonorAmount[] | null;
  /** null while the month is loading */
  total: number | null;
}

function DonorRow({ row }: { row: DonorAmount }) {
  return (
    <li className="row">
      <span className="row-name">{row.name}</span>
      <span className="amount">{formatAmount(row.amount)}</span>
    </li>
  );
}

export function DonorList({ month, rows, total }: Props) {
  const title = t.monthDonations(formatMonthName(month));
  return (
    <section className="card" aria-label={title}>
      <div className="summary">
        <h2 className="card-title">{title}</h2>
        <p className="summary-total">
          {total === null ? <span className="skeleton skeleton-total" aria-label={t.loading} /> : formatAmount(total)}
        </p>
      </div>
      {rows === null ? (
        <p className="empty">
          <span className="skeleton skeleton-line" aria-label={t.loading} />
        </p>
      ) : rows.length === 0 ? (
        <p className="empty">{t.noDonations}</p>
      ) : (
        <ul className="rows">
          {rows.map((row) => (
            <DonorRow key={row.id} row={row} />
          ))}
        </ul>
      )}
    </section>
  );
}
