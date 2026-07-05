import { useEffect, useRef } from 'react';
import { wastageApi } from '../../api/wastageApi';
import { formatWeight, formatCurrency } from '../../utils/formatters';
import { Input } from '../common/FormField';

export default function BagRow({ index, bag, chilliType, pricePerKg, onChange }) {
  const timerRef = useRef(null);

  const handleWeightChange = (e) => {
    const actualWeight = e.target.value;
    onChange(index, { ...bag, actualWeight, grossWeight: null, wastageAmount: null, bagPrice: null });

    clearTimeout(timerRef.current);
    if (!actualWeight || isNaN(actualWeight) || parseFloat(actualWeight) <= 0) return;

    timerRef.current = setTimeout(async () => {
      try {
        const preview = await wastageApi.preview({
          chilliType,
          actualWeight: parseFloat(actualWeight),
        });
        const bagPrice = pricePerKg && preview.grossWeight
          ? (parseFloat(preview.grossWeight) * parseFloat(pricePerKg)).toFixed(4)
          : null;
        onChange(index, {
          ...bag,
          actualWeight,
          wastageAmount: preview.wastageAmount,
          grossWeight: preview.grossWeight,
          bagPrice,
        });
      } catch {
        // preview failed, ignore
      }
    }, 300);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const rowStyle = {
    borderBottom: '1px solid var(--color-border)',
    background: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
  };

  return (
    <tr style={rowStyle}>
      <td className="px-3 py-2 text-sm font-medium" style={{ color: 'var(--color-text-muted)', width: 60 }}>
        {index + 1}
      </td>
      <td className="px-3 py-2" style={{ width: 140 }}>
        <Input
          value={bag.bagSerialNo || `Bag ${index + 1}`}
          onChange={e => onChange(index, { ...bag, bagSerialNo: e.target.value })}
          placeholder={`Bag ${index + 1}`}
        />
      </td>
      <td className="px-3 py-2" style={{ width: 140 }}>
        <Input
          type="number"
          step="0.001"
          min="0.001"
          value={bag.actualWeight || ''}
          onChange={handleWeightChange}
          placeholder="0.000"
        />
      </td>
      <td className="px-3 py-2 text-sm text-right" style={{ color: 'var(--color-text)' }}>
        {bag.wastageAmount != null ? formatWeight(bag.wastageAmount) : '-'}
      </td>
      <td className="px-3 py-2 text-sm text-right font-medium" style={{ color: 'var(--color-primary)' }}>
        {bag.grossWeight != null ? formatWeight(bag.grossWeight) : '-'}
      </td>
      <td className="px-3 py-2 text-sm text-right" style={{ color: 'var(--color-text)' }}>
        {bag.bagPrice != null ? formatCurrency(bag.bagPrice) : '-'}
      </td>
    </tr>
  );
}
