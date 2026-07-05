import BagRow from './BagRow';

export default function BagTable({ bags, noOfBags, chilliType, pricePerKg, onBagChange }) {
  return (
    <div className="overflow-x-auto rounded border" style={{ borderColor: 'var(--color-border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--color-surface-hover)', borderBottom: '2px solid var(--color-border)' }}>
            {['#', 'Bag Serial No', 'Actual Weight (kg)', 'Wastage', 'Gross Weight', 'Price'].map(h => (
              <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide"
                  style={{ color: 'var(--color-text-muted)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: noOfBags || 0 }).map((_, i) => (
            <BagRow
              key={i}
              index={i}
              bag={bags[i] || {}}
              chilliType={chilliType}
              pricePerKg={pricePerKg}
              onChange={onBagChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
