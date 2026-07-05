export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="rounded-lg shadow-xl p-6 w-full max-w-sm"
           style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
