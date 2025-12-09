import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { startLoanPlan } from '../api/coordinator'
import { Goal } from '../types'
import Loader from '../components/Shared/Loader'
import { useToast } from '../components/Shared/Toast'
import { useAuth } from '../contexts/AuthContext'
import { fetchDashboard } from '../api/dashboard'

const GoalDetailPage = () => {
  const { id } = useParams()
  const { addToast } = useToast()
  const { user } = useAuth()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [principal, setPrincipal] = useState(0)
  const [interestRate, setInterestRate] = useState(10)
  const [tenureMonths, setTenureMonths] = useState(12)

  const loadGoal = async () => {
    if (!id) return
    try {
      const data = await fetchDashboard(user?.id || '1')
      const found = data.goals.find((g) => g.id?.toString() === id.toString())
      setGoal(found || null)
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Unable to load goal', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoal()
  }, [id, user?.id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!goal || !id) return
    if (principal <= 0 || tenureMonths <= 0) {
      addToast('Principal and tenure must be positive', 'error')
      return
    }
    try {
      await startLoanPlan({
        userId: user?.id || '1',
        goalId: id,
        principal,
        interestRate,
        tenureMonths,
      })
      addToast('Loan plan kicked off', 'success')
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Loan plan failed', 'error')
    }
  }

  if (loading) return <Loader />
  if (!goal) return <p className="text-sm text-slate-500">Goal not found</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{goal.name}</h1>
        <p className="text-sm text-slate-500">
          Target ₹{goal.targetAmount.toLocaleString()} • {goal.months} months
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Start Loan Plan</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Principal</label>
            <input
              type="number"
              min={1}
              aria-label="loan principal"
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Interest Rate (% p.a.)</label>
            <input
              type="number"
              min={0}
              step="0.1"
              aria-label="loan interest"
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Tenure (months)</label>
            <input
              type="number"
              min={1}
              aria-label="loan tenure"
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              required
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
            >
              Start Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalDetailPage


