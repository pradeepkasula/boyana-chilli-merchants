import { useState } from 'react';
import { reportApi } from '../../api/reportApi';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

export default function ReportByChilliPage() {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [filters, setFilters] = useState({ fromDate: firstOfMonth, toDate: today });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setData(await reportApi.byChilli(filters)); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: 'chilliType', header: 'Chilli Type', render: v => <Badge value={v} /> },
    { key: 'purchaseCount', header: 'Purchases' },
    { key: 'totalActualWt', header: 'Total Actual Wt', render: v => formatWeight(v) },
    { key: 'totalGrossWt', header: 'Total Gross Wt', render: v => formatWeight(v) },
    { key: 'totalPrice', header: 'Total Price', render: v => formatCurrency(v) },
  ];

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--color-text)' }}>
        Purchase Report by Chilli Type
      </h3>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="date" value={filters.fromDate}
               onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
               className="px-3 py-2 rounded border text-sm"
               style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} />
        <input type="date" value={filters.toDate}
               onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
               className="px-3 py-2 rounded border text-sm"
               style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }} />
        <button onClick={load}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: 'var(--color-primary)', color: 'white' }}>
          Generate Report
        </button>
      </div>
      {loading ? <Spinner /> : data && (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
