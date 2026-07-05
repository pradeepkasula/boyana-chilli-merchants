import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { purchaseApi } from '../../api/purchaseApi';
import { partyApi } from '../../api/partyApi';
import FormField, { Input, Select } from '../../components/common/FormField';
import BagTable from '../../components/purchase/BagTable';
import PurchaseTotals from '../../components/purchase/PurchaseTotals';
import { CHILLI_TYPES } from '../../utils/constants';
import Spinner from '../../components/common/Spinner';

export default function PurchaseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const today = new Date().toISOString().split('T')[0];
  const [header, setHeader] = useState({
    purchaseDate: today, sellerId: '', chilliType: 'RED', pricePerKg: '', noOfBags: '',
  });
  const [sellers, setSellers] = useState([]);
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    partyApi.sellers().then(setSellers);
    if (isEdit) {
      setLoading(true);
      purchaseApi.findById(id).then(data => {
        setHeader({
          purchaseDate: data.purchaseDate,
          sellerId: String(data.sellerId),
          chilliType: data.chilliType,
          pricePerKg: String(data.pricePerKg),
          noOfBags: String(data.noOfBags),
        });
        setRemarks(data.remarks || '');
        setBags((data.bags || []).map(b => ({
          bagSerialNo: b.bagSerialNo,
          actualWeight: String(b.actualWeight),
          wastageAmount: b.wastageAmount,
          grossWeight: b.grossWeight,
          bagPrice: b.bagPrice,
        })));
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleNoOfBags = (e) => {
    const n = parseInt(e.target.value) || 0;
    setHeader(h => ({ ...h, noOfBags: e.target.value }));
    setBags(prev => {
      const next = [...prev];
      while (next.length < n) next.push({});
      return next.slice(0, n);
    });
  };

  const handleBagChange = useCallback((index, bagData) => {
    setBags(prev => {
      const next = [...prev];
      next[index] = bagData;
      return next;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noOfBags = parseInt(header.noOfBags);
    const emptyBags = bags.filter(b => !b.actualWeight);
    if (emptyBags.length > 0) {
      setError(`Please enter weights for all ${noOfBags} bags.`);
      return;
    }
    setSaving(true); setError('');
    try {
      const payload = {
        purchaseDate: header.purchaseDate,
        sellerId: parseInt(header.sellerId),
        chilliType: header.chilliType,
        pricePerKg: parseFloat(header.pricePerKg),
        noOfBags,
        remarks,
        bags: bags.map((b, i) => ({
          bagSerialNo: b.bagSerialNo || `Bag ${i + 1}`,
          actualWeight: parseFloat(b.actualWeight),
        })),
      };
      if (isEdit) await purchaseApi.update(id, payload);
      else await purchaseApi.create(payload);
      navigate('/purchases');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save purchase');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const noOfBags = parseInt(header.noOfBags) || 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
          {isEdit ? 'Edit Purchase' : 'New Purchase'}
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/purchases')}
                  className="px-4 py-2 rounded text-sm border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
          <button type="submit" disabled={saving || noOfBags === 0}
                  className="px-4 py-2 rounded text-sm font-medium disabled:opacity-60"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            {saving ? 'Saving...' : 'Save Purchase'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>{error}</div>}

      {/* Header */}
      <div className="rounded-lg border p-5 mb-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h4 className="font-semibold mb-4 pb-2 border-b" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
          Purchase Details
        </h4>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <FormField label="Purchase Date" required>
            <Input type="date" value={header.purchaseDate}
                   onChange={e => setHeader(h => ({ ...h, purchaseDate: e.target.value }))} required />
          </FormField>
          <FormField label="Seller" required>
            <Select value={header.sellerId} onChange={e => setHeader(h => ({ ...h, sellerId: e.target.value }))} required>
              <option value="">-- Select Seller --</option>
              {sellers.map(s => <option key={s.id} value={s.id}>{s.partyName}</option>)}
            </Select>
          </FormField>
          <FormField label="Chilli Type" required>
            <Select value={header.chilliType} onChange={e => setHeader(h => ({ ...h, chilliType: e.target.value }))}>
              {CHILLI_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </FormField>
          <FormField label="Price per KG (₹)" required>
            <Input type="number" step="0.01" min="0.01" value={header.pricePerKg}
                   onChange={e => setHeader(h => ({ ...h, pricePerKg: e.target.value }))} required />
          </FormField>
          <FormField label="Number of Bags" required
                     hint={noOfBags > 0 ? `${noOfBags} weight fields will appear below` : ''}>
            <Input type="number" min="1" max="500" value={header.noOfBags}
                   onChange={handleNoOfBags} required />
          </FormField>
          <FormField label="Remarks">
            <Input value={remarks} onChange={e => setRemarks(e.target.value)} />
          </FormField>
        </div>
      </div>

      {/* Bag entry */}
      {noOfBags > 0 && (
        <div className="mb-5">
          <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
            Bag Weights ({noOfBags} bags)
          </h4>
          <BagTable
            bags={bags}
            noOfBags={noOfBags}
            chilliType={header.chilliType}
            pricePerKg={parseFloat(header.pricePerKg) || 0}
            onBagChange={handleBagChange}
          />
        </div>
      )}

      {/* Totals */}
      {noOfBags > 0 && <PurchaseTotals bags={bags} />}
    </form>
  );
}
