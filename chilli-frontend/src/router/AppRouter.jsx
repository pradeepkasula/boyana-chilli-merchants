import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { ThemeProvider } from '../theme/ThemeContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PartyListPage from '../pages/parties/PartyListPage';
import PartyFormPage from '../pages/parties/PartyFormPage';
import WastageRuleListPage from '../pages/wastage/WastageRuleListPage';
import WastageRuleFormPage from '../pages/wastage/WastageRuleFormPage';
import PurchaseListPage from '../pages/purchases/PurchaseListPage';
import PurchaseFormPage from '../pages/purchases/PurchaseFormPage';
import PurchaseDetailPage from '../pages/purchases/PurchaseDetailPage';
import ReportsPage from '../pages/reports/ReportsPage';
import UserListPage from '../pages/users/UserListPage';
import UserFormPage from '../pages/users/UserFormPage';
import AuditLogPage from '../pages/audit/AuditLogPage';

function Unauthorized() {
  return (
    <div className="text-center py-20" style={{ color: 'var(--color-text)' }}>
      <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>You don't have permission to access this page.</p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Parties */}
              <Route path="parties" element={<PartyListPage />} />
              <Route path="parties/new" element={<PartyFormPage />} />
              <Route path="parties/:id/edit" element={<PartyFormPage />} />

              {/* Wastage Rules */}
              <Route path="wastage-rules" element={<WastageRuleListPage />} />
              <Route path="wastage-rules/new" element={<WastageRuleFormPage />} />
              <Route path="wastage-rules/:id/edit" element={<WastageRuleFormPage />} />

              {/* Purchases */}
              <Route path="purchases" element={<PurchaseListPage />} />
              <Route path="purchases/new" element={<PurchaseFormPage />} />
              <Route path="purchases/:id" element={<PurchaseDetailPage />} />
              <Route path="purchases/:id/edit" element={<PurchaseFormPage />} />

              {/* Reports */}
              <Route path="reports" element={<ReportsPage />} />

              {/* Users — ADMIN+ only */}
              <Route path="users" element={
                <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                  <UserListPage />
                </ProtectedRoute>
              } />
              <Route path="users/new" element={
                <ProtectedRoute roles={['SUPER_ADMIN']}>
                  <UserFormPage />
                </ProtectedRoute>
              } />
              <Route path="users/:id/edit" element={
                <ProtectedRoute roles={['SUPER_ADMIN']}>
                  <UserFormPage />
                </ProtectedRoute>
              } />

              {/* Audit Log — ADMIN+ only */}
              <Route path="audit-log" element={
                <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                  <AuditLogPage />
                </ProtectedRoute>
              } />

              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
