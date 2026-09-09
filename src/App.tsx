import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { GroupingPage } from './pages/GroupingPage'
import { LotsPage } from './pages/LotsPage'
import { MatchingPage } from './pages/MatchingPage'
import { NewLotPage } from './pages/NewLotPage'
import { OperationPage } from './pages/OperationPage'
import { PassportPage } from './pages/PassportPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="lots" element={<LotsPage />} />
          <Route path="lots/nouveau" element={<NewLotPage />} />
          <Route path="matching" element={<MatchingPage />} />
          <Route path="grouping" element={<GroupingPage />} />
          <Route path="operations/:id" element={<OperationPage />} />
          <Route path="passport/:lotId" element={<PassportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
