import { FormEvent, useEffect, useState } from 'react'
import { createTransaction, getTransactions, deleteTransaction } from '../api/transactions'
import Loader from '../components/Shared/Loader'
import { useToast } from '../components/Shared/Toast'
import { useAuth } from '../contexts/AuthContext'

export interface Transaction {
  id: number
  amount: number
  date: string
  time: string
  description?: string
  category?: string
}

const TransactionsPage = () => {
  const { addToast } = useToast()
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // form state
  const [amount, setAmount] = useState<number | ''>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const loadTransactions = async () => {
    try {
      const res = await getTransactions(String(Number(user?.id) || 1))
      setTransactions(res)
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Could not load transactions', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (amount === '' || amount <= 0 || !date || !time) {
      addToast('Please provide valid transaction details', 'error')
      return
    }

    try {
      await createTransaction(
        String(Number(user?.id) || 1),
        amount,
        date,
        time,
        category,
        description
      )

      addToast('Transaction added', 'success')

      // reset form
      setAmount('')
      setDate('')
      setTime('')
      setCategory('')
      setDescription('')

      loadTransactions()
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Failed to add transaction', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id)
      addToast('Transaction deleted', 'success')
      loadTransactions()
    } catch {
      addToast('Failed to delete transaction', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Transactions</h1>
        <p className="text-sm text-slate-500">Track your income and expenses</p>
      </div>

      {/* Create Transaction Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">Amount</label>
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === '' ? '' : Number(e.target.value))
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Time</label>
          <input
            type="time"
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <input
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <input
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            Add Transaction
          </button>
        </div>
      </form>

      {/* Transactions List */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-slate-700">Your Transactions</div>

        {loading ? (
          <Loader />
        ) : transactions.length ? (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded border border-slate-100 p-3"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    ₹{tx.amount.toLocaleString()} • {tx.category || 'General'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {tx.date} at {tx.time} — {tx.description || 'No description'}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(tx.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No transactions yet.</p>
        )}
      </div>
    </div>
  )
}

export default TransactionsPage
