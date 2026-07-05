import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partyApi } from '../../api/partyApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../auth/AuthContext';

export default function PartyListPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [filter, setFilter] = useState({ canSell: '', canBuy: '' });

  const load = async (p = page) => {
    setLoading(true);
    try {
      const res = await partyApi.search({
        page: p, size: 20, search: search || undefined,
        canSell: filter.canSell || undefined,
        canBuy: filter.canBuy || undefined,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useState(() => { load(0); }, []);

  const canWrite = hasRole(['SUPER_ADMIN', 'ADMIN', 'OPERATOR']);
  const canAdmin = hasRole(['SUPER_ADMIN', 'ADMIN']);

  const columns = [
    { key: 'partyName', header: 'Party Name' },
    { key: 'sellerType', header: 'Seller Type', render: v => v ? <Badge value={v} /> : '-' },
    {
      key: 'canSell', header: 'Roles',
      render: (_, row) => (
        <div className="flex gap-1">
          {row.canSell && <Badge value="SELLER" label="Seller" />}
          {row.canBuy && <Badge value="BUYER" label="Buyer" />}
        </div>
      )
    },
    { key: 'phone', header: 'Phone' },
    { key: 'city', header: 'City' },
    {
      key: 'isActive', header: 'Status',
      render: v => <Badge value={v ? 'active' : 'inactive'} label={v ? 'Active' : 'Inactive'} />
    },
    {
      key: 'id', header: 'Actions',
      render: (id, row) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/parties/${id}/edit`)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            Edit
          </button>
          {canAdmin && (
            <button onClick={() => setConfirm({ id, active: !row.isActive, name: row.partyName })}
                    className="text-xs px-2 py-1 rounded border"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
              {row.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Parties</h3>
        {canWrite && (
          <button onClick={() => navigate('/parties/new')}
                  className="px-4 py-2 rounded text-sm font-medium"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            + New Party
          </button>
        )}
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(0)}
          placeholder="Search by name..."
          className="px-3 py-2 rounded border text-sm"
          style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
        />
        <select value={filter.canSell} onChange={e => setFilter(f => ({ ...f, canSell: e.target.value }))}
                className="px-3 py-2 rounded border text-sm"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
          <option value="">All Roles</option>
          <option value="true">Sellers</option>
          <option value="false">Buyers Only</option>
        </select>
        <button onClick={() => load(0)}
                className="px-4 py-2 rounded text-sm"
                style={{ background: 'var(--color-primary)', color: 'white' }}>
          Search
        </button>
      </div>
      <DataTable columns={columns} data={data?.content} loading={loading} />
      {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements}
                            size={20} onPageChange={p => { setPage(p); load(p); }} />}
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.active ? 'Activate Party' : 'Deactivate Party'}
        message={`Are you sure you want to ${confirm?.active ? 'activate' : 'deactivate'} "${confirm?.name}"?`}
        onConfirm={async () => {
          await partyApi.toggleStatus(confirm.id, confirm.active);
          setConfirm(null);
          load(page);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
