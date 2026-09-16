import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Sociogram
        </h1>
        <p className="mt-2 text-sm text-slate-500">Landing page placeholder.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/signup"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create account
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing
