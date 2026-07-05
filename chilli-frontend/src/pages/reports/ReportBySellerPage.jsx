import { useState } from 'react';
import { reportApi } from '../../api/reportApi';
import { partyApi } from '../../api/partyApi';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import Spinner from '../../components/common/Spinner';
import { useEffect } from 'react';

export default function ReportBySellerPage() {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [filters, setFilters] = useState({ fromDate: firstOfMonth, toDate: today, sellerId: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState([]);

  useEffect(() => { partyApi.sellers().then(setSellers); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.sellerId) delete params.sellerId;
      setData(await reportApi.bySeller(params));
    } finally { setLoading(false); }
  };

  const columns = [
    { key: 'sellerName', header: 'Seller Name' },
    { key: 'purchaseCount', header: 'Purchases' },
    { key: 'totalActualWt', header: 'Total Actual Wt', render: v => formatWeight(v) },
    { key: 'totalGrossWt', header: 'Total Gross Wt', render: v => formatWeight(v) },
    { key: 'totalPrice', header: 'Total Price', render: v => formatCurrency(v) },
  ];

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--color-text)' }}>
        Purchase Report by Seller
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
        <select value={filters.sellerId} onChange={e => setFilters(f => ({ ...f, sellerId: e.target.value }))}
                className="px-3 py-2 rounded border text-sm"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
          <option value="">All Sellers</option>
          {sellers.map(s => <option key={s.id} value={s.id}>{s.partyName}</option>)}
        </select>
        <button onClick={load}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: 'var(--color-primary)', color: 'white' }}>
          Generate Report
        </button>
      </div>
      {loading ? <Spinner /> : data && (
        <>
          <DataTable columns={columns} data={data} />
          {data.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No confirmed purchases found for this period.
            </p>
          )}
        </>
      )}
    </div>
  );
}
