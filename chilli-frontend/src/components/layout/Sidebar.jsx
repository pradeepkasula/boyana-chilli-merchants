import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/parties', label: 'Parties', icon: '👥' },
  { to: '/wastage-rules', label: 'Wastage Rules', icon: '⚖' },
  { to: '/purchases', label: 'Purchases', icon: '🛒' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👤', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/audit-log', label: 'Audit Log', icon: '🔍', roles: ['SUPER_ADMIN', 'ADMIN'] },
];

export default function Sidebar() {
  const { hasRole } = useAuth();

  return (
    <aside className="w-64 min-h-screen flex flex-col"
           style={{ background: 'var(--color-sidebar)' }}>
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <h1 className="font-bold leading-tight" style={{ color: 'var(--color-sidebar-active)' }}>
          <span className="text-xl">🌶</span>
          <span className="block text-base mt-0.5">Boyana Chilli</span>
          <span className="block text-xs font-medium opacity-80" style={{ color: 'var(--color-sidebar-text)' }}>Merchants</span>
        </h1>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map(item => {
          if (item.roles && !hasRole(item.roles)) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'font-semibold' : 'hover:opacity-80'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-sidebar-active)' : 'var(--color-sidebar-text)',
                borderLeft: isActive ? '3px solid var(--color-sidebar-active)' : '3px solid transparent',
              })}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
