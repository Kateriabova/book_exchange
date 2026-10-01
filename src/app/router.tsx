import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { AuthPage } from '../pages/AuthPage';
import { CatalogPage } from '../pages/CatalogPage';
import { MyLibraryPage } from '../pages/MyLibraryPage';
import { MyReservationsPage } from '../pages/MyReservationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { useState } from 'react';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5EFE3' }}>
      <AppHeader />
      <main style={{ padding: '16px 0' }}>{children}</main>
    </div>
  );
}

export function AppRouter() {
  const [isAuthenticated] = useState(true); //всегда авторизован (пока не прикручен бэк)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/catalog"
          element={
            isAuthenticated ? (
              <AppLayout>
                <CatalogPage />
              </AppLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/library"
          element={
            isAuthenticated ? (
              <AppLayout>
                <MyLibraryPage />
              </AppLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/reservations"
          element={
            isAuthenticated ? (
              <AppLayout>
                <MyReservationsPage />
              </AppLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
