import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <Link to='/profile'>Profile</Link>
      <p className="text-sm text-slate-500">Home feed placeholder.</p>
    </div>
  )
}

export default Home
