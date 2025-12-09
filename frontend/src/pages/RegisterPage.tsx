import { Link } from 'react-router-dom'
import RegisterForm from '../components/Auth/RegisterForm'

const RegisterPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-center">
        <h1 className="text-xl font-semibold text-slate-800">Join FinScope</h1>
        <p className="text-sm text-slate-500">Create your account</p>
      </div>
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to="/auth/login" className="font-semibold text-primary-600">
          Login
        </Link>
      </p>
    </div>
  </div>
)

export default RegisterPage


