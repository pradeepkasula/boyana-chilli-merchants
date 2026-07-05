import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wastageApi } from '../../api/wastageApi';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../auth/AuthContext';

export default function WastageRuleListPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const canAdmin = hasRole(['SUPER_ADMIN', 'ADMIN']);

  const load = async () => {
    setLoading(true);
    try { setRules(await wastageApi.findAll()); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { key: 'chilliType', header: 'Chilli Type', render: v => <Badge value={v} /> },
    { key: 'weightFromKg', header: 'Weight From (kg)' },
    { key: 'weightToKg', header: 'Weight To (kg)' },
    {
      key: 'wastageType', header: 'Wastage Type',
      render: (v, row) => `${v === 'PERCENTAGE' ? row.wastageValue + '%' : row.wastageValue + ' kg'}`
    },
    { key: 'description', header: 'Description' },
    {
      key: 'isActive', header: 'Status',
      render: v => <Badge value={v ? 'active' : 'inactive'} label={v ? 'Active' : 'Inactive'} />
    },
    canAdmin ? {
      key: 'id', header: 'Actions',
      render: (id) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/wastage-rules/${id}/edit`)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>Edit</button>
          <button onClick={() => setConfirm(id)}
                  className="text-xs px-2 py-1 rounded border"
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}>Delete</button>
        </div>
      )
    } : null,
  ].filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Wastage Rules</h3>
        {canAdmin && (
          <button onClick={() => navigate('/wastage-rules/new')}
                  className="px-4 py-2 rounded text-sm font-medium"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            + New Rule
          </button>
        )}
      </div>
      <DataTable columns={columns} data={rules} loading={loading} />
      <ConfirmDialog
        open={!!confirm}
        title="Delete Wastage Rule"
        message="This rule will be deactivated. Are you sure?"
        onConfirm={async () => {
          await wastageApi.delete(confirm);
          setConfirm(null);
          load();
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
