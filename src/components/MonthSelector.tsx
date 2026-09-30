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
    <nav className="month-nav" aria-label="Month">
      <button
        type="button"
        className="month-arrow"
        aria-label="Previous month"
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
            Back to current month
          </button>
        )}
      </div>
      <button
        type="button"
        className="month-arrow"
        aria-label="Next month"
        disabled={month >= max}
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        ›
      </button>
    </nav>
  );
}
