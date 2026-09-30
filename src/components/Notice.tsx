interface Props {
  title: string;
  text: string;
  onRetry?: () => void;
}

export function Notice({ title, text, onRetry }: Props) {
  return (
    <section className="card notice" role="alert">
      <h2 className="notice-title">{title}</h2>
      <p className="hint">{text}</p>
      {onRetry && (
        <button type="button" className="primary-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
}
