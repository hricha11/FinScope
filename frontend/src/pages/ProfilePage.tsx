import { useAuth } from '../contexts/AuthContext'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
        <p className="text-sm text-slate-500">Your account overview</p>
      </div>
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
    </div>
  )
}

export default ProfilePage


