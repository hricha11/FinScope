import { FormEvent, useEffect, useState } from 'react'
import { commitBudget, getBudget, prepareBudget, setBudget } from '../api/budget'
import { BudgetAllocation } from '../types'
import Loader from '../components/Shared/Loader'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Shared/Toast'

const BudgetPage = () => {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState<number>(0)

  const userId = user?.id || '1'

  const loadBudget = async () => {
    try {
      const data = await getBudget(userId)
      setAllocations(data)
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Unable to fetch budget', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!category || amount <= 0) {
      addToast('Category and amount are required', 'error')
      return
    }
    try {
      await setBudget(userId, category, amount)
      addToast('Budget saved', 'success')
      setCategory('')
      setAmount(0)
      loadBudget()
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Failed to save budget', 'error')
    }
  }

  const simulate2PC = async () => {
    const txId = crypto.randomUUID()
    try {
      await prepareBudget(txId, userId, 'Demo', 1000)
      await commitBudget(txId)
      addToast('Prepare + Commit executed (demo)', 'success')
    } catch (error: any) {
      addToast(error?.response?.data?.message || '2PC call failed', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Budget</h1>
          <p className="text-sm text-slate-500">Manage your allocations</p>
        </div>
        <button
          onClick={simulate2PC}
          className="rounded border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700"
        >
          Demo 2PC Call
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <input
            aria-label="category"
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Amount</label>
          <input
            aria-label="amount"
            type="number"
            min={1}
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2 focus:border-primary-500 focus:outline-none"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            Save
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-slate-700">Allocations</div>
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-2">
            {allocations.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between rounded border border-slate-100 px-3 py-2"
              >
                <div className="text-sm font-medium text-slate-800">{item.category}</div>
                <div className="text-sm text-slate-600">₹ {item.amount.toLocaleString()}</div>
              </div>
            ))}
            {!allocations.length && <p className="text-sm text-slate-500">No allocations yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetPage


