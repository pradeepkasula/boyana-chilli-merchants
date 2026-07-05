import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseApi } from '../../api/purchaseApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate, formatCurrency, formatWeight } from '../../utils/formatters';
import { CHILLI_TYPES, PURCHASE_STATUSES } from '../../utils/constants';
import { useAuth } from '../../auth/AuthContext';

export default function PurchaseListPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', chilliType: '', status: '' });

  const canWrite = hasRole(['SUPER_ADMIN', 'ADMIN', 'OPERATOR']);
  const canAdmin = hasRole(['SUPER_ADMIN', 'ADMIN']);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, size: 20, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      setData(await purchaseApi.search(params));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(0); }, []);

  const columns = [
    { key: 'purchaseDate', header: 'Date', render: v => formatDate(v) },
    { key: 'sellerName', header: 'Seller' },
    { key: 'chilliType', header: 'Chilli', render: v => <Badge value={v} /> },
    { key: 'noOfBags', header: 'Bags' },
    { key: 'totalGrossWt', header: 'Gross Weight', render: v => formatWeight(v) },
    { key: 'totalPrice', header: 'Total Price', render: v => formatCurrency(v) },
    { key: 'status', header: 'Status', render: v => <Badge value={v} /> },
    {
      key: 'id', header: 'Actions',
      render: (id, row) => (
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => navigate(`/purchases/${id}`)}
                  className="text-xs px-2 py-1 rounded border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>View</button>
          {canWrite && row.status === 'DRAFT' && (
            <button onClick={() => navigate(`/purchases/${id}/edit`)}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: 'var(--color-primary)', color: 'white' }}>Edit</button>
          )}
          {canAdmin && row.status === 'DRAFT' && (
            <button onClick={() => setAction({ type: 'confirm', id })}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: '#10b981', color: 'white' }}>Confirm</button>
          )}
          {canAdmin && row.status !== 'CANCELLED' && (
            <button onClick={() => setAction({ type: 'cancel', id })}
                    className="text-xs px-2 py-1 rounded border"
                    style={{ borderColor: '#ef4444', color: '#ef4444' }}>Cancel</button>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Purchases</h3>
        {canWrite && (
          <button onClick={() => navigate('/purchases/new')}
                  className="px-4 py-2 rounded text-sm font-medium"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            + New Purchase
          </button>
        )}
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="date" value={filters.fromDate} onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
               className="px-3 py-2 rounded border text-sm"
               style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} />
        <input type="date" value={filters.toDate} onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
               className="px-3 py-2 rounded border text-sm"
               style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} />
        <select value={filters.chilliType} onChange={e => setFilters(f => ({ ...f, chilliType: e.target.value }))}
                className="px-3 py-2 rounded border text-sm"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
          <option value="">All Types</option>
          {CHILLI_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 rounded border text-sm"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
          <option value="">All Statuses</option>
          {PURCHASE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button onClick={() => load(0)}
                className="px-4 py-2 rounded text-sm"
                style={{ background: 'var(--color-primary)', color: 'white' }}>Filter</button>
      </div>
      <DataTable columns={columns} data={data?.content} loading={loading} />
      {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements}
                            size={20} onPageChange={p => { setPage(p); load(p); }} />}
      <ConfirmDialog
        open={!!action}
        title={action?.type === 'confirm' ? 'Confirm Purchase' : 'Cancel Purchase'}
        message={`Are you sure you want to ${action?.type} this purchase?`}
        onConfirm={async () => {
          if (action.type === 'confirm') await purchaseApi.confirm(action.id);
          else await purchaseApi.cancel(action.id);
          setAction(null);
          load(page);
        }}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
