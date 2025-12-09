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
      setLoading(true)
      const resp = await fetchDashboard(user?.id ?? 1)
      console.log('📊 Dashboard response:', resp)
      setData(resp)
    } catch (error: any) {
      console.error('❌ Failed to load dashboard:', error)
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

  if (!data) {
    return (
      <div className="p-4 text-sm text-slate-600">
        Could not load dashboard data.
      </div>
    )
  }

  // ✅ SAFE FALLBACKS – no more crashes on undefined
  const goals = data.goals ?? []
  const budgets = (data as any).budgets ?? [] // adjust when you know actual key
  const recentTransactions = data.recentTransactions ?? []

  const monthlyIncome = data.monthlyIncome ?? 0
  const totalAllocated = data.totalAllocated ?? 0
  const emiAllocation = data.emiAllocation ?? 0
  const availableForSavings = data.availableForSavings ?? 0

  const activeUserId = data.userId ?? user?.id ?? 1

  return (
    <div className="space-y-6">
      {/* TEMP: show raw JSON so page is never blank & we can inspect the API */}
      <div className="rounded-lg bg-slate-900 text-slate-100 p-3 text-xs">
        <div className="mb-1 font-semibold text-emerald-300">Raw Dashboard JSON</div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Your finances at a glance</p>
        </div>
        <button
          onClick={() => setLoanModalOpen(true)}
          disabled={!goals.length}
          className="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Start Loan Plan
        </button>
      </div>

      <SummaryCards
        income={monthlyIncome}
        allocated={totalAllocated}
        emi={emiAllocation}
        available={availableForSavings}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetPie data={budgets} />
        </div>
        <GoalsPreview goals={goals} />
      </div>

      <RecentTransactions data={recentTransactions} />

      <StartLoanModal
        isOpen={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        userId={String(activeUserId)}
        goals={goals}
        onSuccess={loadData}
      />
    </div>
  )
}

export default DashboardPage
