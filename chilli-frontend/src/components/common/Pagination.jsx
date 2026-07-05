export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex items-center justify-between mt-4 text-sm"
         style={{ color: 'var(--color-text-muted)' }}>
      <span>Showing {start}–{end} of {totalElements}</span>
      <div className="flex gap-1">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 rounded border disabled:opacity-40"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          Prev
        </button>
        <span className="px-3 py-1">{page + 1} / {totalPages}</span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 rounded border disabled:opacity-40"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
