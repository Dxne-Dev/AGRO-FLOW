import { Link } from 'react-router-dom';

export function EmptyState({
  title,
  body,
  to,
  cta,
}: {
  title: string;
  body: string;
  to?: string;
  cta?: string;
}) {
  return (
    <div
      role="status"
      className="rounded-[20px] border border-dashed border-black/10 bg-white p-8 text-center"
    >
      <p className="font-bold text-af-ink">{title}</p>
      <p className="mt-2 text-sm text-af-muted">{body}</p>
      {to && cta ? (
        <Link
          to={to}
          className="mt-4 inline-flex h-12 items-center rounded-2xl bg-af-green px-4 text-sm font-bold text-white uppercase hover:bg-af-green-dark"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
