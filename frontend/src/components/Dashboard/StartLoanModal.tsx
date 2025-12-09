import { FormEvent, useEffect, useMemo, useState } from 'react'
import { startLoanPlan } from '../../api/coordinator'
import { Goal, LoanPlanPayload } from '../../types'
import { useToast } from '../Shared/Toast'

interface Props {
  isOpen: boolean
  onClose: () => void
  userId: string
  goals: Goal[]
  onSuccess?: () => void
}

const StartLoanModal = ({ isOpen, onClose, userId, goals, onSuccess }: Props) => {
  const { addToast } = useToast()
  const [goalId, setGoalId] = useState(goals?.[0]?.id || '')
  const [principal, setPrincipal] = useState(0)
  const [interestRate, setInterestRate] = useState(10)
  const [tenureMonths, setTenureMonths] = useState(12)
  const [submitting, setSubmitting] = useState(false)

  // Ensure selected goal stays in sync when goals list updates
  useEffect(() => {
    if (!goalId && goals?.length) {
      setGoalId(goals[0].id)
    }
  }, [goals, goalId])

  const emi = useMemo(() => {
    if (!principal || !interestRate || !tenureMonths) return 0
    const monthlyRate = interestRate / 100 / 12
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)
    const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1
    return denominator === 0 ? 0 : Math.round(numerator / denominator)
  }, [principal, interestRate, tenureMonths])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (principal <= 0 || tenureMonths <= 0) {
      addToast('Principal and tenure must be positive values', 'error')
      return
    }
    const payload: LoanPlanPayload = {
      userId,
      goalId,
      principal,
      interestRate,
      tenureMonths,
    }
    setSubmitting(true)
    try {
      await startLoanPlan(payload)
      addToast('Loan plan started via coordinator', 'success')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Unable to start loan plan', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  if (!goals.length) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
        <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Start Loan Plan</h3>
            <button aria-label="close modal" onClick={onClose} className="text-slate-500 hover:text-slate-700">
              ✕
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Create a goal first to start a loan plan.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Start Loan Plan</h3>
          <button aria-label="close modal" onClick={onClose} className="text-slate-500 hover:text-slate-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="goal">
              Goal
            </label>
            <select
              id="goal"
              aria-label="select goal"
              required
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
            >
              <option value="" disabled>
                Select goal
              </option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="principal">
                Principal
              </label>
              <input
                id="principal"
                type="number"
                aria-label="principal"
                min={1}
                required
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="interestRate">
                Interest Rate (% p.a.)
              </label>
              <input
                id="interestRate"
                aria-label="interest rate"
                type="number"
                min={0}
                step="0.1"
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="tenure">
                Tenure (months)
              </label>
              <input
                id="tenure"
                aria-label="tenure months"
                type="number"
                min={1}
                required
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Estimated EMI</div>
              <div className="mt-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xl font-semibold text-primary-700">
                ₹ {emi.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                EMI is calculated locally to preview impact before commit.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
            >
              {submitting ? 'Starting...' : 'Start Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StartLoanModal

