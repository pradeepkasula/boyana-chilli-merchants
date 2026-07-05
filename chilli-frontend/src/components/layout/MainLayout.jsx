import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Breadcrumb from './Breadcrumb';

const CURRENT_YEAR = new Date().getFullYear();

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ background: 'var(--color-bg)' }}>
        <TopBar />
        <Breadcrumb />
        <main className="flex-1 px-6 pb-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="px-6 py-3 border-t text-center text-xs"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface)' }}>
          &copy; {CURRENT_YEAR} Boyana Chilli Merchants. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
