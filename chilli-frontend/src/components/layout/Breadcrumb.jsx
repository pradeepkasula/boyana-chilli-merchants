import { Link, useLocation } from 'react-router-dom';

function getBreadcrumbs(pathname) {
  const home = { label: 'Home', to: '/dashboard' };

  if (pathname === '/dashboard')
    return [{ label: 'Dashboard' }];

  if (pathname === '/parties')
    return [home, { label: 'Parties' }];
  if (pathname === '/parties/new')
    return [home, { label: 'Parties', to: '/parties' }, { label: 'New Party' }];
  if (pathname.match(/^\/parties\/\d+\/edit$/))
    return [home, { label: 'Parties', to: '/parties' }, { label: 'Edit Party' }];

  if (pathname === '/wastage-rules')
    return [home, { label: 'Wastage Rules' }];
  if (pathname === '/wastage-rules/new')
    return [home, { label: 'Wastage Rules', to: '/wastage-rules' }, { label: 'New Wastage Rule' }];
  if (pathname.match(/^\/wastage-rules\/\d+\/edit$/))
    return [home, { label: 'Wastage Rules', to: '/wastage-rules' }, { label: 'Edit Wastage Rule' }];

  if (pathname === '/purchases')
    return [home, { label: 'Purchases' }];
  if (pathname === '/purchases/new')
    return [home, { label: 'Purchases', to: '/purchases' }, { label: 'New Purchase' }];
  if (pathname.match(/^\/purchases\/\d+\/edit$/))
    return [home, { label: 'Purchases', to: '/purchases' }, { label: 'Edit Purchase' }];
  if (pathname.match(/^\/purchases\/\d+$/))
    return [home, { label: 'Purchases', to: '/purchases' }, { label: 'Purchase Detail' }];

  if (pathname === '/reports')
    return [home, { label: 'Reports' }];

  if (pathname === '/users')
    return [home, { label: 'User Management' }];
  if (pathname === '/users/new')
    return [home, { label: 'User Management', to: '/users' }, { label: 'New User' }];
  if (pathname.match(/^\/users\/\d+\/edit$/))
    return [home, { label: 'User Management', to: '/users' }, { label: 'Edit User' }];

  if (pathname === '/audit-log')
    return [home, { label: 'Audit Log' }];

  return [home];
}

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const crumbs = getBreadcrumbs(pathname);
  const pageTitle = crumbs[crumbs.length - 1].label;

  return (
    <div className="px-6 pt-5 pb-2">
      {/* Page heading */}
      <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
        {pageTitle}
      </h2>

      {/* Breadcrumb trail */}
      <nav aria-label="breadcrumb">
        <ol className="flex items-center flex-wrap gap-1 text-xs">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1">
                {idx > 0 && (
                  <span style={{ color: 'var(--color-text-muted)' }}>›</span>
                )}
                {!isLast && crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="hover:underline transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: isLast ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
