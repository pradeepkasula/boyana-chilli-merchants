const COLORS = {
  SUPER_ADMIN: '#7c3aed',
  ADMIN: '#2563eb',
  OPERATOR: '#0891b2',
  VIEWER: '#6b7280',
  DRAFT: '#f59e0b',
  CONFIRMED: '#10b981',
  CANCELLED: '#ef4444',
  RED: '#dc2626',
  WHITE: '#6b7280',
  MIXED: '#f59e0b',
  FARMER: '#16a34a',
  BROKER: '#2563eb',
  OTHER_ENTERPRISE: '#7c3aed',
  active: '#10b981',
  inactive: '#ef4444',
};

export default function Badge({ value, label }) {
  const bg = COLORS[value] || '#6b7280';
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
          style={{ background: bg }}>
      {label || value}
    </span>
  );
}
