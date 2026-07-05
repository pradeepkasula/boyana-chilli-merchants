export default function FormField({ label, error, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          {label} {required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>
      )}
      {error && (
        <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
      )}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded border text-sm outline-none focus:ring-2 ${className}`}
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        borderColor: 'var(--color-border)',
      }}
      {...props}
    />
  );
}

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 rounded border text-sm outline-none ${className}`}
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        borderColor: 'var(--color-border)',
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 rounded border text-sm outline-none resize-y ${className}`}
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        borderColor: 'var(--color-border)',
      }}
      rows={3}
      {...props}
    />
  );
}
