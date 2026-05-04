/** Base d’URL du back-office (définie au build via VITE_ADMIN_PATH, ex. /gestion-7k2). */
function normalizeAdminPath(raw: string | undefined): string {
  const v = (raw ?? '/admin').trim() || '/admin'
  const withSlash = v.startsWith('/') ? v : `/${v}`
  return withSlash.replace(/\/+$/, '') || '/admin'
}

export const ADMIN_BASE_PATH = normalizeAdminPath(import.meta.env.VITE_ADMIN_PATH)

/** Chemin relatif pour React Router (sans slash initial). */
export const ADMIN_ROUTE_BASE = ADMIN_BASE_PATH.replace(/^\/+/, '')

export const ADMIN_DASHBOARD_RELATIVE = `${ADMIN_ROUTE_BASE}/dashboard`

/** Affiche un lien « Admin » dans la nav (désactivé par défaut — réservé au dev si besoin). */
export const SHOW_ADMIN_IN_NAV = import.meta.env.VITE_SHOW_ADMIN_NAV === 'true'
