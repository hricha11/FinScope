import { FormEvent, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../Shared/Toast'

const RegisterForm = () => {
  const { register } = useAuth()
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      addToast('Account created', 'success')
    } catch (error: any) {
      addToast(error?.response?.data?.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          aria-label="name"
          required
          className="mt-1 w-full rounded border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          aria-label="email"
          type="email"
          required
          className="mt-1 w-full rounded border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          aria-label="password"
          type="password"
          required
          className="mt-1 w-full rounded border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded bg-primary-600 px-4 py-2 font-medium text-white transition hover:bg-primary-500 disabled:opacity-60"
      >
        {loading ? 'Creating...' : 'Register'}
      </button>
    </form>
  )
}

export default RegisterForm


