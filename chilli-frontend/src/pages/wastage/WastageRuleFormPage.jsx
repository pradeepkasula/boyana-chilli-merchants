import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { wastageApi } from '../../api/wastageApi';
import FormField, { Input, Select } from '../../components/common/FormField';
import { CHILLI_TYPES, WASTAGE_TYPES } from '../../utils/constants';
import Spinner from '../../components/common/Spinner';

const EMPTY = { chilliType: 'RED', weightFromKg: '', weightToKg: '', wastageType: 'PERCENTAGE', wastageValue: '', description: '' };

export default function WastageRuleFormPage() {
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
      wastageApi.findById(id).then(data => setForm({ ...data })).finally(() => setLoading(false));
    }
  }, [id]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        weightFromKg: parseFloat(form.weightFromKg),
        weightToKg: parseFloat(form.weightToKg),
        wastageValue: parseFloat(form.wastageValue),
      };
      if (isEdit) await wastageApi.update(id, payload);
      else await wastageApi.create(payload);
      navigate('/wastage-rules');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
          {isEdit ? 'Edit Wastage Rule' : 'New Wastage Rule'}
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/wastage-rules')}
                  className="px-4 py-2 rounded text-sm border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
          <button type="submit" disabled={saving}
                  className="px-4 py-2 rounded text-sm font-medium disabled:opacity-60"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            {saving ? 'Saving...' : 'Save Rule'}
          </button>
        </div>
      </div>
      {error && <div className="mb-4 p-3 rounded text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>{error}</div>}
      <div className="rounded-lg border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <FormField label="Chilli Type" required>
            <Select value={form.chilliType} onChange={set('chilliType')} required>
              {CHILLI_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </FormField>
          <FormField label="Weight From (kg)" required>
            <Input type="number" step="0.001" min="0.001" value={form.weightFromKg} onChange={set('weightFromKg')} required />
          </FormField>
          <FormField label="Weight To (kg)" required>
            <Input type="number" step="0.001" min="0.001" value={form.weightToKg} onChange={set('weightToKg')} required />
          </FormField>
          <FormField label="Wastage Type" required>
            <Select value={form.wastageType} onChange={set('wastageType')} required>
              {WASTAGE_TYPES.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </Select>
          </FormField>
          <FormField label={form.wastageType === 'PERCENTAGE' ? 'Wastage (%)' : 'Wastage (kg)'} required>
            <Input type="number" step="0.001" min="0.001" value={form.wastageValue} onChange={set('wastageValue')} required />
          </FormField>
          <div className="col-span-2 lg:col-span-3">
            <FormField label="Description">
              <Input value={form.description || ''} onChange={set('description')} />
            </FormField>
          </div>
        </div>
      </div>
    </form>
  );
}
