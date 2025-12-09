import { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Shared/Toast'
import { addIncome } from '../api/income'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const { addToast } = useToast()

  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddIncome = async (e: FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      addToast('User ID missing. Please re-login.', 'error')
      return
    }

    try {
      setIsSubmitting(true)

      await addIncome(String(user.id), Number(monthlyIncome))

      setMonthlyIncome('')
      setShowIncomeForm(false)
      addToast('Monthly income updated successfully!', 'success')
    } catch (error) {
      console.error(error)
      addToast('Failed to update income. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
        <p className="text-sm text-slate-500">Your account overview</p>
      </div>

      {/* User card */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-slate-700">User</div>
        <p className="text-sm text-slate-600">Name: {user?.name || '—'}</p>
        <p className="text-sm text-slate-600">Email: {user?.email || '—'}</p>
        <button
          onClick={logout}
          className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
        >
          Logout
        </button>
      </div>

      {/* Monthly income card */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-700">
              Monthly Income
            </div>
            <p className="text-xs text-slate-500">
              Add or update your monthly income
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowIncomeForm((prev) => !prev)}
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            {showIncomeForm ? 'Cancel' : 'Add / Update'}
          </button>
        </div>

        {showIncomeForm && (
          <form onSubmit={handleAddIncome} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
                min={0}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Saving…' : 'Save Income'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
