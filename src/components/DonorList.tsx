import { formatAmount } from '../lib/format';
import { formatMonthName } from '../lib/month';

export interface DonorAmount {
  id: number;
  name: string;
  /** null while the month is loading */
  amount: number | null;
}

interface Props {
  month: string;
  rows: DonorAmount[];
  /** null while the month is loading */
  total: number | null;
}

function Amount({ value }: { value: number | null }) {
  if (value === null) return <span className="skeleton skeleton-amount" aria-label="Loading" />;
  return <span className={value === 0 ? 'amount amount-zero' : 'amount'}>{formatAmount(value)}</span>;
}

function DonorRow({ row }: { row: DonorAmount }) {
  return (
    <li className="row">
      <span className="row-name">{row.name}</span>
      <Amount value={row.amount} />
    </li>
  );
}

export function DonorList({ month, rows, total }: Props) {
  return (
    <section className="card" aria-label="Donations this month">
      <div className="summary">
        <h2 className="card-title">{formatMonthName(month)} donations</h2>
        <p className="summary-total">
          {total === null ? <span className="skeleton skeleton-total" aria-label="Loading" /> : formatAmount(total)}
        </p>
        {total === 0 && <p className="hint">No donations this month</p>}
      </div>
      {rows.length === 0 ? (
        <p className="empty">No donors yet</p>
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
