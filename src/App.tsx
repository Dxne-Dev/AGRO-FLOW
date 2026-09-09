import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { GroupingPage } from './pages/GroupingPage';
import { LoginPage } from './pages/LoginPage';
import { LotsPage } from './pages/LotsPage';
import { MatchingPage } from './pages/MatchingPage';
import { NewLotPage } from './pages/NewLotPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OperationPage } from './pages/OperationPage';
import { OperationsPage } from './pages/OperationsPage';
import { PassportPage } from './pages/PassportPage';
import { ProfilePage } from './pages/ProfilePage';
import { AppStateProvider } from './state/AppState';

function PassportShell() {
  return (
    <div className="min-h-screen bg-af-canvas text-af-ink">
      <main className="mx-auto w-full max-w-[390px] px-5 py-6 md:max-w-3xl md:px-8 md:py-10">
        <PassportPage />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/passport/:lotId" element={<PassportShell />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />

            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/lots" element={<LotsPage />} />
                <Route path="/lots/nouveau" element={<NewLotPage />} />
                <Route path="/matching" element={<MatchingPage />} />
                <Route path="/grouping" element={<GroupingPage />} />
                <Route path="/operations" element={<OperationsPage />} />
                <Route path="/operations/:id" element={<OperationPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </AuthProvider>
  );
}
