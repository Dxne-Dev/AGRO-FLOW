import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { GroupingPage } from './pages/GroupingPage';
import { LotsPage } from './pages/LotsPage';
import { MatchingPage } from './pages/MatchingPage';
import { NewLotPage } from './pages/NewLotPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OperationPage } from './pages/OperationPage';
import { OperationsPage } from './pages/OperationsPage';
import { PassportPage } from './pages/PassportPage';
import { ProfilePage } from './pages/ProfilePage';
import { AppStateProvider } from './state/AppState';

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lots" element={<LotsPage />} />
            <Route path="/lots/nouveau" element={<NewLotPage />} />
            <Route path="/matching" element={<MatchingPage />} />
            <Route path="/grouping" element={<GroupingPage />} />
            <Route path="/operations" element={<OperationsPage />} />
            <Route path="/operations/:id" element={<OperationPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/passport/:lotId" element={<PassportPage />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
