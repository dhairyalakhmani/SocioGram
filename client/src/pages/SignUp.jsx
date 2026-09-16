import heroImg from '../assets/hero.png'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import { useAuth } from '../context/AuthContext';

function SignUp() {
  const [form , setForm] = useState({name : '' , username : '' , email:'' , password:''})
  const [dob, setDob] = useState({ month: '', day: '', year: '' })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loader, setLoader] = useState(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

   const handleChange = (e)=>{
      setForm((prev)=>({...prev ,[e.target.name] : e.target.value}))
   }

   const handleDobChange = (e)=>{
      setDob((prev)=>({...prev ,[e.target.name] : e.target.value}))
   }

   const handleSubmit = async (e)=> {
      e.preventDefault();
      setError('')

      const name = form.name.trim()
      const username = form.username.trim()
      const email = form.email.trim()
      const password = form.password

      // --- Full name ---
      if (!name) return setError('Full name is required.')
      if (name.length < 2) return setError('Full name must be at least 2 characters.')
      if (name.length > 50) return setError('Full name must be 50 characters or fewer.')

      // --- Username ---
      if (!username) return setError('Username is required.')
      if (username.length < 3) return setError('Username must be at least 3 characters.')
      if (username.length > 20) return setError('Username must be 20 characters or fewer.')
      if (!/^[a-zA-Z0-9._]+$/.test(username)) return setError('Username can only use letters, numbers, dots and underscores.')
      if (username.startsWith('.') || username.endsWith('.')) return setError('Username cannot start or end with a dot.')
      if (username.includes('..')) return setError('Username cannot contain two dots in a row.')

      // --- Email ---
      if (!email) return setError('Email address is required.')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Enter a valid email address.')

      // --- Password (min 8 matches the server) ---
      if (!password) return setError('Password is required.')
      if (password.length < 8) return setError('Password must be at least 8 characters.')
      if (password.length > 64) return setError('Password must be 64 characters or fewer.')
      if (!/[a-zA-Z]/.test(password)) return setError('Password must contain at least one letter.')
      if (!/[0-9]/.test(password)) return setError('Password must contain at least one number.')

      // --- Date of birth ---
      if (!dob.month || !dob.day || !dob.year) return setError('Please select your full date of birth.')
      const monthIndex = months.indexOf(dob.month)
      const day = Number(dob.day)
      const year = Number(dob.year)
      const birthDate = new Date(year, monthIndex, day)
      // new Date(2000, 1, 31) silently rolls over to March, so compare it back.
      if (birthDate.getMonth() !== monthIndex || birthDate.getDate() !== day) {
        return setError('That date does not exist. Please check your date of birth.')
      }
      const today = new Date()
      let age = today.getFullYear() - year
      const beforeBirthdayThisYear =
        today.getMonth() < monthIndex ||
        (today.getMonth() === monthIndex && today.getDate() < day)
      if (beforeBirthdayThisYear) age -= 1
      if (age < 13) return setError('You must be at least 13 years old to join Sociogram.')

      // --- Terms ---
      if (!agreed) return setError('Please accept the Terms of Service and Privacy Policy.')

      setLoader(true)
      try{
        const response = await axiosInstance.post('/users/register', {
          name,
          username,
          email,
          password,
        })
        setUser(response.data.userData)
        navigate('/home')
      } catch(error){
        setError(error.response?.data?.message || 'Something went wrong. Please try again.')
      } finally {
        setLoader(false)
      }
   }
  return (
    <div className="min-h-screen w-full bg-slate-50 lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- Left : brand panel ---------- */}
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-fuchsia-300/25 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Sociogram
          </span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Where your circle
            <br />
            comes together.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-indigo-100">
            Share the moments that matter, follow the people you love, and
            discover stories from every corner of the world.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
            <img
              src={heroImg}
              alt="Sociogram feed preview"
              className="h-56 w-full object-cover"
            />
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="flex -space-x-3">
            {avatarTones.map((tone) => (
              <span
                key={tone}
                className={`h-10 w-10 rounded-full ring-2 ring-white/80 ${tone}`}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-indigo-100">
            Join <span className="font-bold text-white">2.4M+</span> people
            already on Sociogram
          </p>
        </div>
      </aside>

      {/* ---------- Right : sign up form ---------- */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* logo, mobile only */}
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <LogoMark className="h-10 w-10 ring-1 ring-slate-200" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Sociogram
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
            <header>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                It only takes a minute. Free forever.
              </p>
            </header>

            {/* social sign up */}
            <div className="mt-7 grid grid-cols-3 gap-3">
              <SocialButton label="Sign up with Google">
                <GoogleIcon />
              </SocialButton>
              <SocialButton label="Sign up with Apple">
                <AppleIcon />
              </SocialButton>
              <SocialButton label="Sign up with GitHub">
                <GithubIcon />
              </SocialButton>
            </div>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                or
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Field label="Full name" htmlFor="fullName">
                <input
                  id="fullName"
                  type="text"
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ada Lovelace"
                  className={inputClass}
                  />
              </Field>

              <Field label="Username" htmlFor="username">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                  <span className="pl-3.5 pr-1 text-sm font-medium text-slate-400">
                    @
                  </span>
                  <input
                    id="username"
                    type="text"
                    name='username'
                    value={form.username}
                    onChange={handleChange}
                    placeholder="adalovelace"
                    className="w-full rounded-r-xl bg-transparent py-2.5 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                </div>
              </Field>

              <Field label="Email address" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                  />
              </Field>

              <Field
                label="Password"
                htmlFor="password"
                hint="At least 8 characters"
                >
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    aria-label="Show password"
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-slate-600"
                    >
                    <EyeIcon />
                  </button>
                </div>
              </Field>

              <Field label="Date of birth" htmlFor="dobMonth">
                <div className="grid grid-cols-3 gap-3">
                  <select id="dobMonth" name="month" className={selectClass} value={dob.month} onChange={handleDobChange}>
                    <option value="" disabled>
                      Month
                    </option>
                    {months.map((month) => (
                      <option key={month}>{month}</option>
                    ))}
                  </select>
                  <select id="dobDay" name="day" className={selectClass} value={dob.day} onChange={handleDobChange}>
                    <option value="" disabled>
                      Day
                    </option>
                    {days.map((day) => (
                      <option key={day}>{day}</option>
                    ))}
                  </select>
                  <select id="dobYear" name="year" className={selectClass} value={dob.year} onChange={handleDobChange}>
                    <option value="" disabled>
                      Year
                    </option>
                    {years.map((year) => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </Field>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200"
                  />
                <span className="text-xs leading-relaxed text-slate-500">
                  I agree to Sociogram&rsquo;s{' '}
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:underline"
                    >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:underline"
                    >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={loader}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.99]"
              >
                {loader ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

/* ---------------- shared styles + data ---------------- */

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100'

const selectClass =
  'w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100'

const avatarTones = [
  'bg-amber-300',
  'bg-rose-300',
  'bg-emerald-300',
  'bg-sky-300',
]

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const years = Array.from({ length: 100 }, (_, i) => 2026 - i)

/* ---------------- small pieces ---------------- */

function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function SocialButton({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex items-center justify-center rounded-xl border border-slate-300 bg-white py-2.5 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
    >
      {children}
    </button>
  )
}

/* ---------------- icons ---------------- */

function LogoMark({ className = '' }) {
  return (
    <span
      className={`grid place-items-center rounded-2xl bg-white/95 shadow-lg ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-2/3 w-2/3" aria-hidden="true">
        <defs>
          <linearGradient id="sg-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#c026d3" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#sg-logo)"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M7.5 10.5 16 5.5M7.5 12h8.5M7.5 13.5 16 18.5" />
        </g>
        <g fill="url(#sg-logo)">
          <circle cx="5.5" cy="12" r="2.6" />
          <circle cx="18" cy="4.5" r="2.2" />
          <circle cx="18" cy="12" r="2.2" />
          <circle cx="18" cy="19.5" r="2.2" />
        </g>
      </svg>
    </span>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.2h6.6c-.1 1.1-.8 2.8-2.4 3.9l3.6 2.8c2.2-2.1 3.7-5 3.7-8.7Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.6-2.8c-1 .7-2.3 1.2-4.2 1.2a7.1 7.1 0 0 1-6.7-4.9L1.5 17.4A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.6a7.4 7.4 0 0 1 0-5.2L1.5 6.6a12 12 0 0 0 0 10.8l3.8-2.8Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.4-3.3C17.9 1.4 15.2 0 12 0 7.3 0 3.3 2.7 1.5 6.6l3.8 2.8A7.2 7.2 0 0 1 12 4.7Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-slate-900"
      aria-hidden="true"
    >
      <path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2.1-1.1 2.9-2.3c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.6-1-2.6-3.5ZM14.2 4.9c.6-.8 1-1.9.9-3-1 0-2.2.7-2.9 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.3-.6 3-1.4Z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-slate-900"
      aria-hidden="true"
    >
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.2 4.6 18.2 5 18.2 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default SignUp
