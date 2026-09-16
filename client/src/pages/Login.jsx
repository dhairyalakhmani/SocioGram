import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loader, setLoader] = useState(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const email = form.email.trim()
    const password = form.password

    // --- Email ---
    if (!email) return setError('Email address is required.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Enter a valid email address.')

    // --- Password ---
    // Only a presence check here. Strength rules belong on signup: an account
    // created under older rules still has to be able to log in.
    if (!password) return setError('Password is required.')

    setLoader(true)
    try {
      const response = await axiosInstance.post('/users/login', { email, password })
      setUser(response.data.userData)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Log in to Sociogram
        </h1>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            />
          </div>

          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loader}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loader ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
