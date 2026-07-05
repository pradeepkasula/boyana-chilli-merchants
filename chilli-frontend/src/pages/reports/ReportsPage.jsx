import { useState } from 'react';
import ReportBySellerPage from './ReportBySellerPage';
import ReportByChilliPage from './ReportByChilliPage';

const TABS = [
  { key: 'seller', label: 'By Seller' },
  { key: 'chilli', label: 'By Chilli Type' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('seller');

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-5 py-2 text-sm font-medium -mb-px border-b-2 transition-colors"
            style={{
              borderColor: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'seller' ? <ReportBySellerPage /> : <ReportByChilliPage />}
    </div>
  );
}
