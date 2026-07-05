import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import FormField, { Input, Select } from '../../components/common/FormField';
import { ROLES } from '../../utils/constants';
import Spinner from '../../components/common/Spinner';

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '', phone: '', role: 'VIEWER', isActive: true });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      userApi.findById(id).then(data => setForm({ ...data, password: '' })).finally(() => setLoading(false));
    }
  }, [id]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (isEdit) {
        await userApi.update(id, { fullName: form.fullName, email: form.email, phone: form.phone, role: form.role, isActive: form.isActive });
        if (newPassword) await userApi.resetPassword(id, { newPassword });
      } else {
        await userApi.create({ ...form });
      }
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
          {isEdit ? 'Edit User' : 'New User'}
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/users')}
                  className="px-4 py-2 rounded text-sm border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
          <button type="submit" disabled={saving}
                  className="px-4 py-2 rounded text-sm font-medium disabled:opacity-60"
                  style={{ background: 'var(--color-primary)', color: 'white' }}>
            {saving ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </div>
      {error && <div className="mb-4 p-3 rounded text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>{error}</div>}
      <div className="rounded-lg border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <FormField label="Username" required>
            <Input value={form.username} onChange={set('username')} required disabled={isEdit} />
          </FormField>
          <FormField label="Full Name" required>
            <Input value={form.fullName} onChange={set('fullName')} required />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={form.email || ''} onChange={set('email')} />
          </FormField>
          <FormField label="Phone">
            <Input value={form.phone || ''} onChange={set('phone')} />
          </FormField>
          <FormField label="Role" required>
            <Select value={form.role} onChange={set('role')} required>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </Select>
          </FormField>
          {isEdit && (
            <div className="flex items-center gap-2 col-span-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
                <input type="checkbox" checked={form.isActive} onChange={set('isActive')} className="w-4 h-4" />
                Active
              </label>
            </div>
          )}
          {!isEdit ? (
            <FormField label="Password" required>
              <Input type="password" value={form.password} onChange={set('password')} required minLength={4} />
            </FormField>
          ) : (
            <FormField label="New Password" hint="Leave blank to keep existing password">
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={4} />
            </FormField>
          )}
        </div>
      </div>
    </form>
  );
}
