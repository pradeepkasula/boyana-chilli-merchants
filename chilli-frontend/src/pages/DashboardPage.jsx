import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(['SUPER_ADMIN', 'ADMIN']);

  const cards = [
    { label: 'Parties', icon: '👥', to: '/parties', desc: 'Manage sellers and buyers' },
    { label: 'Wastage Rules', icon: '⚖', to: '/wastage-rules', desc: 'Configure wastage calculations' },
    { label: 'Purchases', icon: '🛒', to: '/purchases', desc: 'Record chilli bag purchases' },
    { label: 'Reports', icon: '📊', to: '/reports', desc: 'View purchase summaries' },
    ...(isAdmin ? [
      { label: 'User Management', icon: '👤', to: '/users', desc: 'Manage system users and roles' },
      { label: 'Audit Log', icon: '🔍', to: '/audit-log', desc: 'Track all system changes' },
    ] : []),
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Welcome, {user?.fullName}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Boyana Chilli Merchants · Role: {user?.role}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map(card => (
          <a
            key={card.label}
            href={card.to}
            className="rounded-xl p-6 border transition-shadow hover:shadow-md block"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{card.label}</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{card.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
