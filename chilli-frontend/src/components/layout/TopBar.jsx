import { useAuth } from '../../auth/AuthContext';
import { useTheme, THEMES } from '../../theme/ThemeContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
        Boyana Chilli Merchants
      </span>
      <div className="flex items-center gap-4">
        <select
          value={theme}
          onChange={e => setTheme(e.target.value)}
          className="text-sm px-2 py-1 rounded border"
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
          }}
        >
          {THEMES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {user?.fullName} <span className="opacity-60">({user?.role})</span>
        </span>
        <button
          onClick={logout}
          className="text-sm px-3 py-1 rounded transition-colors"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
