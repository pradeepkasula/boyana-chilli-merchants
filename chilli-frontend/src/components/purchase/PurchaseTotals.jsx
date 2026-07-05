import { useMemo } from 'react';
import { formatWeight, formatCurrency } from '../../utils/formatters';

export default function PurchaseTotals({ bags }) {
  const totals = useMemo(() => {
    return bags.reduce((acc, bag) => ({
      totalActualWt: acc.totalActualWt + (parseFloat(bag.actualWeight) || 0),
      totalGrossWt: acc.totalGrossWt + (parseFloat(bag.grossWeight) || 0),
      totalPrice: acc.totalPrice + (parseFloat(bag.bagPrice) || 0),
      bagsWithWeight: acc.bagsWithWeight + (bag.actualWeight ? 1 : 0),
    }), { totalActualWt: 0, totalGrossWt: 0, totalPrice: 0, bagsWithWeight: 0 });
  }, [bags]);

  const items = [
    { label: 'Bags Entered', value: `${totals.bagsWithWeight} / ${bags.length}` },
    { label: 'Total Actual Weight', value: formatWeight(totals.totalActualWt) },
    { label: 'Total Gross Weight', value: formatWeight(totals.totalGrossWt) },
    { label: 'Total Price', value: formatCurrency(totals.totalPrice), highlight: true },
  ];

  return (
    <div className="sticky bottom-0 rounded-lg border p-4 grid grid-cols-4 gap-4 shadow-lg"
         style={{ background: 'var(--color-surface)', borderColor: 'var(--color-primary)' }}>
      {items.map(item => (
        <div key={item.label} className="text-center">
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
          <p className={`font-bold text-base ${item.highlight ? 'text-lg' : ''}`}
             style={{ color: item.highlight ? 'var(--color-primary)' : 'var(--color-text)' }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
