import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import { formatDateTime } from '../../utils/formatters';

export default function UserListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async (p = 0) => {
    setLoading(true);
    try { setData(await userApi.findAll({ page: p, size: 20 })); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(0); }, []);

  const columns = [
    { key: 'username', header: 'Username' },
    { key: 'fullName', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: v => <Badge value={v} /> },
    { key: 'isActive', header: 'Status', render: v => <Badge value={v ? 'active' : 'inactive'} label={v ? 'Active' : 'Inactive'} /> },
    { key: 'insertedDate', header: 'Created', render: v => formatDateTime(v) },
    {
      key: 'id', header: 'Actions',
      render: id => (
        <button onClick={() => navigate(`/users/${id}/edit`)}
                className="text-xs px-2 py-1 rounded"
                style={{ background: 'var(--color-primary)', color: 'white' }}>Edit</button>
      )
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Users</h3>
        <button onClick={() => navigate('/users/new')}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: 'var(--color-primary)', color: 'white' }}>
          + New User
        </button>
      </div>
      <DataTable columns={columns} data={data?.content} loading={loading} />
      {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements}
                            size={20} onPageChange={p => { setPage(p); load(p); }} />}
    </div>
  );
}
