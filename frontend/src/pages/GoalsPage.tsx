import { FormEvent, useEffect, useState } from 'react'
import { createGoal } from '../api/goals'
import { fetchDashboard } from '../api/dashboard'
import { Goal } from '../types'
import Loader from '../components/Shared/Loader'
import { useToast } from '../components/Shared/Toast'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const GoalsPage = () => {
  const { addToast } = useToast()
  const { user } = useAuth()

  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState<number | ''>('')   // 👈 blank by default
  const [months, setMonths] = useState<number | ''>('')               // 👈 blank by default

  const loadGoals = async () => {
    try {
      const data = await fetchDashboard(user?.id || '1')
      setGoals(data.goals)
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Could not load goals', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name || targetAmount === '' || months === '') {
      addToast('Please provide valid goal details', 'error')
      return
    }

    const numericTarget = Number(targetAmount)
    const numericMonths = Number(months)

    if (numericTarget <= 0 || numericMonths <= 0) {
      addToast('Target amount and months must be positive', 'error')
      return
    }

    try {
      await createGoal({
        userId: Number(user?.id) || 1,
        name,
        targetAmount: numericTarget,
        targetMonths: numericMonths,
      })

      addToast('Goal created', 'success')

      // reset form – keep everything blank
      setName('')
      setTargetAmount('')
      setMonths('')
      loadGoals()
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Failed to create goal', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Goals</h1>
          <p className="text-sm text-slate-500">Plan and track your targets</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            aria-label="goal name"
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Target Amount</label>
          <input
            aria-label="target amount"
            type="number"
            min={1}
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
            value={targetAmount}
            onChange={(e) =>
              setTargetAmount(e.target.value === '' ? '' : Number(e.target.value))
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Months</label>
          <input
            aria-label="months"
            type="number"
            min={1}
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
            value={months}
            onChange={(e) =>
              setMonths(e.target.value === '' ? '' : Number(e.target.value))
            }
            required
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            Create Goal
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-slate-700">Your Goals</div>
        {loading ? (
          <Loader />
        ) : goals.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {goals.map((goal) => (
              <Link
                to={`/goals/${goal.id}`}
                key={goal.id}
                className="rounded border border-slate-100 p-3 transition hover:border-primary-200"
              >
                <div className="text-sm font-semibold text-slate-800">{goal.name}</div>
                <div className="text-xs text-slate-500">
                  Target ₹{goal.targetAmount.toLocaleString()} • {goal.months} months
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No goals yet.</p>
        )}
      </div>
    </div>
  )
}

export default GoalsPage
