import { t } from '../i18n';
import { formatMonth, shiftMonth } from '../lib/month';

interface Props {
  month: string;
  today: string;
  min: string;
  max: string;
  onChange: (month: string) => void;
}

export function MonthSelector({ month, today, min, max, onChange }: Props) {
  return (
    <nav className="month-nav" aria-label={t.month}>
      <button
        type="button"
        className="month-arrow"
        aria-label={t.previousMonth}
        disabled={month <= min}
        onClick={() => onChange(shiftMonth(month, -1))}
      >
        ‹
      </button>
      <div className="month-current">
        <span className="month-label" aria-live="polite">
          {formatMonth(month)}
        </span>
        {month !== today && (
          <button type="button" className="link-button" onClick={() => onChange(today)}>
            {t.backToCurrentMonth}
          </button>
        )}
      </div>
      <button
        type="button"
        className="month-arrow"
        aria-label={t.nextMonth}
        disabled={month >= max}
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        ›
      </button>
    </nav>
  );
}
