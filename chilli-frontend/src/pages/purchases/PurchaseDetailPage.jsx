import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseApi } from '../../api/purchaseApi';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { formatDate, formatCurrency, formatWeight, formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../auth/AuthContext';

export default function PurchaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const canAdmin = hasRole(['SUPER_ADMIN', 'ADMIN']);
  const canWrite = hasRole(['SUPER_ADMIN', 'ADMIN', 'OPERATOR']);

  useEffect(() => {
    purchaseApi.findById(id)
      .then(setPurchase)
      .catch(() => setError('Failed to load purchase'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async () => {
    setActionLoading(true);
    try { setPurchase(await purchaseApi.confirm(id)); }
    catch (e) { setError(e.response?.data?.message || 'Failed to confirm'); }
    finally { setActionLoading(false); }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this purchase?')) return;
    setActionLoading(true);
    try { setPurchase(await purchaseApi.cancel(id)); }
    catch (e) { setError(e.response?.data?.message || 'Failed to cancel'); }
    finally { setActionLoading(false); }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-4 text-sm" style={{ color: '#ef4444' }}>{error}</div>;
  if (!purchase) return null;

  const card = (label, value, highlight = false) => (
    <div key={label}>
      <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      <p className={`font-semibold ${highlight ? 'text-lg' : 'text-sm'}`}
         style={{ color: highlight ? 'var(--color-primary)' : 'var(--color-text)' }}>
        {value}
      </p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/purchases')}
                  className="text-sm px-3 py-1.5 rounded border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            ← Back
          </button>
          <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
            Purchase #{purchase.id}
          </h3>
          <Badge value={purchase.status} />
        </div>
        <div className="flex gap-2">
          {canWrite && purchase.status === 'DRAFT' && (
            <button onClick={() => navigate(`/purchases/${id}/edit`)}
                    className="px-3 py-1.5 rounded text-sm"
                    style={{ background: 'var(--color-primary)', color: 'white' }}>
              Edit
            </button>
          )}
          {canAdmin && purchase.status === 'DRAFT' && (
            <button onClick={handleConfirm} disabled={actionLoading}
                    className="px-3 py-1.5 rounded text-sm disabled:opacity-60"
                    style={{ background: '#10b981', color: 'white' }}>
              Confirm
            </button>
          )}
          {canAdmin && purchase.status !== 'CANCELLED' && (
            <button onClick={handleCancel} disabled={actionLoading}
                    className="px-3 py-1.5 rounded text-sm border disabled:opacity-60"
                    style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>{error}</div>}

      {/* Summary */}
      <div className="rounded-lg border p-5 mb-5 grid grid-cols-3 gap-4 lg:grid-cols-6"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        {card('Date', formatDate(purchase.purchaseDate))}
        {card('Seller', purchase.sellerName)}
        {card('Chilli Type', purchase.chilliType)}
        {card('Price / KG', formatCurrency(purchase.pricePerKg))}
        {card('Total Bags', purchase.noOfBags)}
        {card('Status', purchase.status)}
      </div>

      {/* Totals */}
      <div className="rounded-lg border p-5 mb-5 grid grid-cols-3 gap-4"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-primary)' }}>
        {card('Total Actual Weight', formatWeight(purchase.totalActualWt))}
        {card('Total Gross Weight', formatWeight(purchase.totalGrossWt))}
        {card('Total Price', formatCurrency(purchase.totalPrice), true)}
      </div>

      {/* Bags table */}
      <div className="rounded-lg border mb-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="px-5 py-3 border-b font-semibold text-sm"
             style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
          Bag Details ({purchase.bags?.length || 0} bags)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-surface-hover)' }}>
                {['#', 'Serial No', 'Actual Weight', 'Wastage', 'Gross Weight', 'Price/KG', 'Bag Price'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(purchase.bags || []).map((bag, i) => (
                <tr key={bag.id}
                    style={{ borderBottom: '1px solid var(--color-border)',
                             background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)' }}>
                  <td className="px-4 py-2" style={{ color: 'var(--color-text-muted)' }}>{i + 1}</td>
                  <td className="px-4 py-2 font-medium" style={{ color: 'var(--color-text)' }}>{bag.bagSerialNo}</td>
                  <td className="px-4 py-2" style={{ color: 'var(--color-text)' }}>{formatWeight(bag.actualWeight)}</td>
                  <td className="px-4 py-2" style={{ color: 'var(--color-text-muted)' }}>{formatWeight(bag.wastageAmount)}</td>
                  <td className="px-4 py-2 font-semibold" style={{ color: 'var(--color-primary)' }}>{formatWeight(bag.grossWeight)}</td>
                  <td className="px-4 py-2" style={{ color: 'var(--color-text)' }}>{formatCurrency(bag.pricePerKg)}</td>
                  <td className="px-4 py-2 font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(bag.bagPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit info */}
      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Created by {purchase.insertedBy} on {formatDateTime(purchase.insertedDate)}
        {purchase.updatedBy && ` · Updated by ${purchase.updatedBy} on ${formatDateTime(purchase.updatedDate)}`}
        {purchase.remarks && <span> · Remarks: {purchase.remarks}</span>}
      </div>
    </div>
  );
}
