import { useState } from 'react';
import { auditApi } from '../../api/auditApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import { formatDateTime } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';

const ENTITY_NAMES = ['users', 'parties', 'wastage_rules', 'purchases', 'purchase_bags'];

export default function AuditLogPage() {
  const [filters, setFilters] = useState({ entityName: '', changedBy: '', fromDate: '', toDate: '' });
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const params = { page: p, size: 50, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      setData(await auditApi.search(params));
      setPage(p);
    } finally { setLoading(false); }
  };

  const columns = [
    { key: 'changedAt', header: 'Date/Time', render: v => formatDateTime(v) },
    { key: 'entityName', header: 'Entity', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'entityId', header: 'Record ID' },
    { key: 'action', header: 'Action', render: v => <Badge value={v === 'CREATE' ? 'CONFIRMED' : v === 'DELETE' ? 'CANCELLED' : 'DRAFT'} label={v} /> },
    { key: 'changedBy', header: 'Changed By' },
    {
      key: 'id', header: 'Details',
      render: (id, row) => (
        <button onClick={() => setExpanded(expanded === id ? null : id)}
                className="text-xs px-2 py-1 rounded border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
          {expanded === id ? 'Hide' : 'View'}
        </button>
      )
    },
  ];

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--color-text)' }}>Audit Log</h3>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap items-end">
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Entity</label>
          <select value={filters.entityName} onChange={e => setFilters(f => ({ ...f, entityName: e.target.value }))}
                  className="px-3 py-2 rounded border text-sm"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
            <option value="">All Entities</option>
            {ENTITY_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Changed By</label>
          <input value={filters.changedBy} onChange={e => setFilters(f => ({ ...f, changedBy: e.target.value }))}
                 placeholder="username"
                 className="px-3 py-2 rounded border text-sm"
                 style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>From</label>
          <input type="date" value={filters.fromDate} onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
                 className="px-3 py-2 rounded border text-sm"
                 style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>To</label>
          <input type="date" value={filters.toDate} onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
                 className="px-3 py-2 rounded border text-sm"
                 style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} />
        </div>
        <button onClick={() => load(0)}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: 'var(--color-primary)', color: 'white' }}>
          Search
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          {data && data.content.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No audit records found. Run a search to view logs.
            </p>
          )}
          {data && data.content.length > 0 && (
            <>
              <div className="overflow-x-auto rounded border" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--color-surface-hover)' }}>
                      {columns.map(col => (
                        <th key={col.key} className="px-4 py-3 text-left font-semibold"
                            style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}>
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.content.map((row, i) => (
                      <>
                        <tr key={row.id}
                            style={{ borderBottom: '1px solid var(--color-border)',
                                     background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)' }}>
                          {columns.map(col => (
                            <td key={col.key} className="px-4 py-2" style={{ color: 'var(--color-text)' }}>
                              {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                            </td>
                          ))}
                        </tr>
                        {expanded === row.id && (
                          <tr key={`detail-${row.id}`} style={{ background: 'var(--color-surface-hover)' }}>
                            <td colSpan={columns.length} className="px-4 py-3">
                              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                <div>
                                  <p className="font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>Before</p>
                                  <pre className="p-2 rounded overflow-auto max-h-48"
                                       style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                                    {row.oldValue ? JSON.stringify(JSON.parse(row.oldValue), null, 2) : 'N/A'}
                                  </pre>
                                </div>
                                <div>
                                  <p className="font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>After</p>
                                  <pre className="p-2 rounded overflow-auto max-h-48"
                                       style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                                    {row.newValue ? JSON.stringify(JSON.parse(row.newValue), null, 2) : 'N/A'}
                                  </pre>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements}
                          size={50} onPageChange={p => load(p)} />
            </>
          )}
        </>
      )}
    </div>
  );
}
