import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminSeo } from '../components/admin/AdminSeo'
import { getAdminSession, loginAdmin } from '../lib/api'
import { ADMIN_BASE_PATH } from '../lib/adminRoutes'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void getAdminSession().then((s) => {
      if (s) navigate(`${ADMIN_BASE_PATH}/dashboard`, { replace: true })
    })
  }, [navigate])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginAdmin(email.trim(), password)
      navigate(`${ADMIN_BASE_PATH}/dashboard`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-teranga-night px-6 py-16 text-teranga-paper">
      <AdminSeo />
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-teranga-gold/90">Espace pro</p>
        <h1 className="mt-3 font-display text-3xl">Teranga Saveurs</h1>
        <p className="mt-2 text-sm text-white/55">
          Connexion avec le compte créé dans Supabase (Authentication).
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/45">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-teranga-gold/50"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/45">
            Mot de passe
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-teranga-gold/50"
            />
          </label>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full rounded-full bg-teranga-paper py-3 text-sm font-semibold uppercase tracking-[0.2em] text-teranga-night transition hover:bg-teranga-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Connexion…' : 'Entrer'}
          </button>
        </form>

        <Link
          to="/"
          className="mt-8 inline-block text-xs uppercase tracking-[0.22em] text-white/40 transition hover:text-white/70"
        >
          ← Retour au site
        </Link>
      </div>
    </div>
  )
}
