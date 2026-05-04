import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminSeo } from '../components/admin/AdminSeo'
import {
  fetchAdminState,
  getAdminSession,
  logoutAdmin,
  saveAdminRestaurant,
  uploadAdminImage,
} from '../lib/api'
import { ADMIN_BASE_PATH } from '../lib/adminRoutes'
import { formatFcfa } from '../lib/format'
import type { Dish, FullRestaurant } from '../types/restaurant'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [full, setFull] = useState<FullRestaurant | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchAdminState()
      setFull(data)
    } catch (e) {
      setError((e as Error).message)
      navigate(ADMIN_BASE_PATH, { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    void (async () => {
      const session = await getAdminSession()
      if (!session) {
        navigate(ADMIN_BASE_PATH, { replace: true })
        return
      }
      await load()
    })()
  }, [load, navigate])

  const updateDish = (id: string, patch: Partial<Dish>) => {
    setFull((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        dishes: prev.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      }
    })
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!full) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const next = await saveAdminRestaurant({
        isOpen: full.isOpen,
        heroImageUrl: full.heroImageUrl,
        whatsappE164: full.whatsappE164,
        dishes: full.dishes,
      })
      setFull(next)
      setMessage('Modifications enregistrées.')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function onUpload(file: File, target: '1' | '2' | 'hero') {
    setMessage(null)
    setError(null)
    try {
      const { db } = await uploadAdminImage(file, target)
      setFull(db)
      setMessage('Image mise à jour.')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function logout() {
    await logoutAdmin()
    navigate(ADMIN_BASE_PATH, { replace: true })
  }

  if (!full) {
    return (
      <>
        <AdminSeo />
        <div className="flex min-h-screen items-center justify-center bg-teranga-night text-white/50">
          Chargement…
        </div>
      </>
    )
  }

  return (
    <>
      <AdminSeo />
      <div className="min-h-screen bg-[#0b0908] px-5 py-10 text-teranga-paper md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-teranga-gold/90">Administration</p>
            <h1 className="mt-2 font-display text-4xl">Teranga Saveurs</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              Ici le restaurateur met à jour les <strong className="text-white/80">plats du jour</strong> (1 ou 2),
              le <strong className="text-white/80">statut ouvert / fermé</strong>, le{' '}
              <strong className="text-white/80">numéro WhatsApp</strong> et les visuels. Les visiteurs voient le
              résultat immédiatement sur le site.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.18em] text-white/70 transition hover:border-teranga-gold/50 hover:text-white"
            >
              Voir le site
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/15"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {message ? (
          <p className="mt-6 text-sm text-emerald-300/90" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-6 text-sm text-rose-300" role="alert">
            {error}
          </p>
        ) : null}

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Visites (site)</p>
            <p className="mt-2 font-display text-3xl">{full.stats.siteVisits}</p>
            <p className="mt-1 text-xs text-white/40">
              Dernière :{' '}
              {full.stats.lastVisitAt
                ? new Date(full.stats.lastVisitAt).toLocaleString('fr-FR')
                : '—'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Modifs admin</p>
            <p className="mt-2 font-display text-3xl">{full.stats.adminUpdates}</p>
            <p className="mt-1 text-xs text-white/40">
              Dernière :{' '}
              {full.stats.lastAdminUpdateAt
                ? new Date(full.stats.lastAdminUpdateAt).toLocaleString('fr-FR')
                : '—'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Statut affiché</p>
            <p className="mt-2 text-lg text-white/85">{full.isOpen ? 'Ouvert' : 'Fermé'}</p>
            <p className="mt-1 text-xs text-white/40">Visible sur la page d’accueil</p>
          </div>
        </section>

        <form onSubmit={onSave} className="mt-12 space-y-10">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <h2 className="font-display text-2xl">Réglages généraux</h2>
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <label className="flex items-center gap-3 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={full.isOpen}
                  onChange={(e) => setFull({ ...full, isOpen: e.target.checked })}
                  className="h-4 w-4 accent-teranga-gold"
                />
                Restaurant ouvert aujourd’hui
              </label>
            </div>
            <label className="mt-6 block text-xs uppercase tracking-[0.2em] text-white/45">
              WhatsApp (chiffres, ex. 33612345678)
              <input
                value={full.whatsappE164}
                onChange={(e) => setFull({ ...full, whatsappE164: e.target.value.replace(/\D/g, '') })}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-teranga-gold/50"
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-white/45">
              Image du hero (URL complète ou /uploads/…)
              <input
                value={full.heroImageUrl}
                onChange={(e) => setFull({ ...full, heroImageUrl: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-teranga-gold/50"
              />
            </label>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Ou remplacer par un fichier</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  e.target.value = ''
                  if (f) void onUpload(f, 'hero')
                }}
                className="mt-2 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.18em] file:text-white/80"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {full.dishes.map((d) => (
              <div
                key={d.id}
                className={`rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8 transition-opacity ${d.isActive !== false ? '' : 'opacity-50 grayscale'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.28em] text-teranga-gold/90">
                    Plat du jour {d.id}
                  </p>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-white/80">
                    <input
                      type="checkbox"
                      checked={d.isActive !== false}
                      onChange={(e) => updateDish(d.id, { isActive: e.target.checked })}
                      className="h-4 w-4 accent-teranga-gold cursor-pointer"
                    />
                    Rendre visible
                  </label>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <img src={d.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                </div>
                <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-white/45">
                  Nom
                  <input
                    value={d.name}
                    onChange={(e) => updateDish(d.id, { name: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-teranga-gold/50"
                  />
                </label>
                <label className="mt-3 block text-xs uppercase tracking-[0.2em] text-white/45">
                  Description
                  <textarea
                    value={d.description}
                    onChange={(e) => updateDish(d.id, { description: e.target.value })}
                    rows={4}
                    className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-teranga-gold/50"
                  />
                </label>
                <label className="mt-3 block text-xs uppercase tracking-[0.2em] text-white/45">
                  Prix ({formatFcfa(d.price)})
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={d.price}
                    onChange={(e) => updateDish(d.id, { price: Number(e.target.value) })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-teranga-gold/50"
                  />
                </label>
                <label className="mt-3 block text-xs uppercase tracking-[0.2em] text-white/45">
                  Image (URL ou upload ci-dessous)
                  <input
                    value={d.imageUrl}
                    onChange={(e) => updateDish(d.id, { imageUrl: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-teranga-gold/50"
                  />
                </label>
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (f) void onUpload(f, d.id as '1' | '2')
                    }}
                    className="block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.18em] file:text-white/80"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-teranga-paper px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-teranga-night transition hover:bg-teranga-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer textes & prix'}
            </button>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-full border border-white/15 px-8 py-3 text-sm uppercase tracking-[0.2em] text-white/70 transition hover:border-teranga-gold/50 hover:text-white"
            >
              Recharger depuis le serveur
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
