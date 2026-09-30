import { t } from '../i18n';
import { formatMonth } from '../lib/month';

interface Props {
  /** Past months with data, newest first */
  months: string[];
  selected: string;
  onSelect: (month: string) => void;
}

export function Archive({ months, selected, onSelect }: Props) {
  if (months.length === 0) return null;
  return (
    <details className="card archive">
      <summary className="archive-summary">{t.archive}</summary>
      <ul className="rows">
        {months.map((month) => (
          <li key={month}>
            <button
              type="button"
              className="row archive-item"
              aria-current={month === selected ? 'true' : undefined}
              onClick={() => onSelect(month)}
            >
              <span className="row-name">{formatMonth(month)}</span>
              <span className="archive-mark" aria-hidden="true">
                {month === selected ? '✓' : '›'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
