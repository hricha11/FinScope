import { useEffect, useState } from 'react'
import { fetchDashboard } from '../api/dashboard'
import { DashboardResponse } from '../types'
import SummaryCards from '../components/Dashboard/SummaryCards'
import BudgetPie from '../components/Dashboard/BudgetPie'
import RecentTransactions from '../components/Dashboard/RecentTransactions'
import GoalsPreview from '../components/Dashboard/GoalsPreview'
import StartLoanModal from '../components/Dashboard/StartLoanModal'
import Loader from '../components/Shared/Loader'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Shared/Toast'

const DashboardPage = () => {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [loanModalOpen, setLoanModalOpen] = useState(false)

  const loadData = async () => {
    try {
      const resp = await fetchDashboard(user?.id || '1')
      setData(resp)
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Failed to load dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Loader />
        <Loader />
      </div>
    )
  }

  if (!data) return null

  const activeUserId = data.userId || user?.id || '1'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Your finances at a glance</p>
        </div>
        <button
          onClick={() => setLoanModalOpen(true)}
          disabled={!data.goals.length}
          className="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Start Loan Plan
        </button>
      </div>

      <SummaryCards
        income={data.monthlyIncome}
        allocated={data.totalAllocated}
        emi={data.emiAllocation}
        available={data.availableForSavings}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetPie data={data.budgets} />
        </div>
        <GoalsPreview goals={data.goals} />
      </div>

      <RecentTransactions data={data.recentTransactions} />

      <StartLoanModal
        isOpen={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        userId={activeUserId}
        goals={data.goals}
        onSuccess={loadData}
      />
    </div>
  )
}

export default DashboardPage

