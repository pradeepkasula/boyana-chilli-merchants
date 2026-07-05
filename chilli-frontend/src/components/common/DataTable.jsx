import Spinner from './Spinner';

export default function DataTable({ columns, data, loading, emptyMessage = 'No records found.' }) {
  if (loading) return <Spinner />;

  return (
    <div className="overflow-x-auto rounded border" style={{ borderColor: 'var(--color-border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--color-surface-hover)' }}>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold"
                style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center"
                  style={{ color: 'var(--color-text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="transition-colors"
              style={{ borderBottom: '1px solid var(--color-border)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3" style={{ color: 'var(--color-text)' }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
