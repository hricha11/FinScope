import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
    <h1 className="text-3xl font-semibold text-slate-800">404</h1>
    <p className="mt-2 text-sm text-slate-500">Page not found.</p>
    <Link to="/dashboard" className="mt-4 rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
      Go home
    </Link>
  </div>
)

export default NotFoundPage


