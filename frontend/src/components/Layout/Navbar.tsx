import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const initials = user?.name?.[0] || user?.email?.[0] || 'U'

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-lg font-semibold text-primary-600">FinScope</div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="user menu"
          >
            {initials.toUpperCase()}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-100 bg-white shadow-lg">
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  navigate('/profile')
                  setOpen(false)
                }}
              >
                Profile
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar


