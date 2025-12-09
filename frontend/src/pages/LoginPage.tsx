import { Link } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'

const LoginPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-center">
        <h1 className="text-xl font-semibold text-slate-800">FinScope UI</h1>
        <p className="text-sm text-slate-500">Sign in to continue</p>
      </div>
      <LoginForm />
      <p className="mt-4 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/auth/register" className="font-semibold text-primary-600">
          Create an account
        </Link>
      </p>
    </div>
  </div>
)

export default LoginPage


