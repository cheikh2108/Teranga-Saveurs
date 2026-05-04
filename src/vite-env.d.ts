/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Chemin du back-office, ex. /gestion-x9 (défaut /admin). Défini au moment du build. */
  readonly VITE_ADMIN_PATH?: string
  /** Mettre à "true" pour afficher un lien Admin dans la nav (déconseillé en prod). */
  readonly VITE_SHOW_ADMIN_NAV?: string
}
