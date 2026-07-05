import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { partyApi } from '../../api/partyApi';
import FormField, { Input, Select, Textarea } from '../../components/common/FormField';
import { SELLER_TYPES } from '../../utils/constants';
import Spinner from '../../components/common/Spinner';

const EMPTY = {
  partyName: '', sellerType: '', canSell: false, canBuy: false,
  contactPerson: '', phone: '', email: '',
  addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
  gstin: '', pan: '', bankName: '', bankAccount: '', bankIfsc: '', notes: '',
};

function Section({ title, children }) {
  return (
    <div className="rounded-lg border p-5 mb-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <h4 className="font-semibold mb-4 pb-2 border-b" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>{title}</h4>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{children}</div>
    </div>
  );
}

export default function PartyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      partyApi.findById(id).then(data => {
        setForm({ ...EMPTY, ...data, sellerType: data.sellerType || '' });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.canSell && !form.canBuy) {
      setError('Party must be a seller, buyer, or both.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, sellerType: form.sellerType || null };
      if (isEdit) {
        await partyApi.update(id, payload);
      } else {
        await partyApi.create(payload);
      }
      navigate('/parties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save party');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
          {isEdit ? 'Edit Party' : 'New Party'}
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/parties')}
                  className="px-4 py-2 rounded text-sm border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            Cancel
          </button>
          <button type="submit" disabled={saving}
                  className="px-4 py-2 rounded text-sm font-medium disabled:opacity-60"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            {saving ? 'Saving...' : 'Save Party'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>{error}</div>}

      <Section title="Basic Information">
        <div className="col-span-2 lg:col-span-2">
          <FormField label="Party Name" required>
            <Input value={form.partyName} onChange={set('partyName')} required />
          </FormField>
        </div>
        <FormField label="Seller Type">
          <Select value={form.sellerType} onChange={set('sellerType')}>
            <option value="">-- None --</option>
            {SELLER_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </FormField>
        <div className="col-span-3 flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
            <input type="checkbox" checked={form.canSell} onChange={set('canSell')} className="w-4 h-4" />
            This party can SELL (is a seller)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
            <input type="checkbox" checked={form.canBuy} onChange={set('canBuy')} className="w-4 h-4" />
            This party can BUY (is a buyer)
          </label>
        </div>
      </Section>

      <Section title="Contact Details">
        <FormField label="Contact Person">
          <Input value={form.contactPerson} onChange={set('contactPerson')} />
        </FormField>
        <FormField label="Phone">
          <Input value={form.phone} onChange={set('phone')} />
        </FormField>
        <FormField label="Email">
          <Input type="email" value={form.email} onChange={set('email')} />
        </FormField>
        <FormField label="Address Line 1">
          <Input value={form.addressLine1} onChange={set('addressLine1')} />
        </FormField>
        <FormField label="Address Line 2">
          <Input value={form.addressLine2} onChange={set('addressLine2')} />
        </FormField>
        <FormField label="City">
          <Input value={form.city} onChange={set('city')} />
        </FormField>
        <FormField label="State">
          <Input value={form.state} onChange={set('state')} />
        </FormField>
        <FormField label="Pincode">
          <Input value={form.pincode} onChange={set('pincode')} maxLength={10} />
        </FormField>
      </Section>

      <Section title="Financial Details">
        <FormField label="GSTIN">
          <Input value={form.gstin} onChange={set('gstin')} maxLength={20} />
        </FormField>
        <FormField label="PAN">
          <Input value={form.pan} onChange={set('pan')} maxLength={20} />
        </FormField>
        <FormField label="Bank Name">
          <Input value={form.bankName} onChange={set('bankName')} />
        </FormField>
        <FormField label="Bank Account No">
          <Input value={form.bankAccount} onChange={set('bankAccount')} />
        </FormField>
        <FormField label="IFSC Code">
          <Input value={form.bankIfsc} onChange={set('bankIfsc')} />
        </FormField>
      </Section>

      <div className="rounded-lg border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Notes</h4>
        <Textarea value={form.notes} onChange={set('notes')} rows={3} />
      </div>
    </form>
  );
}
