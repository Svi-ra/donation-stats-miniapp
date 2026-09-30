import type { Expense } from '../api/expenses';
import { formatAmount } from '../lib/format';

interface Props {
  /** null while the month is loading */
  expenses: Expense[] | null;
}

function ExpenseRow({ expense }: { expense: Expense }) {
  return (
    <li className="row">
      <span className="row-name">{expense.name}</span>
      <span className="amount">{formatAmount(expense.amount)}</span>
    </li>
  );
}

export function Expenses({ expenses }: Props) {
  return (
    <section className="card" aria-label="Expenses this month">
      <h2 className="card-title card-title-padded">Expenses</h2>
      {expenses === null ? (
        <p className="empty">
          <span className="skeleton skeleton-line" aria-label="Loading" />
        </p>
      ) : expenses.length === 0 ? (
        <p className="empty">No expenses this month</p>
      ) : (
        <>
          <ul className="rows">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}
          </ul>
          <div className="row row-total">
            <span className="row-name">Total expenses</span>
            <span className="amount">
              {formatAmount(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
