import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import BudgetPage from './pages/BudgetPage'
import GoalsPage from './pages/GoalsPage'
import GoalDetailPage from './pages/GoalDetailPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import TransactionPage from './pages/TransactionPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import './index.css'

const AppShell = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  </div>
)

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/:id" element={<GoalDetailPage />} />
          <Route path="/transactions" element={<TransactionPage/>} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App


