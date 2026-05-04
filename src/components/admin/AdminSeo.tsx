import { useEffect } from 'react'

/** Empêche l’indexation des pages admin par les moteurs de recherche. */
export function AdminSeo() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'robots')
    meta.setAttribute('content', 'noindex, nofollow')
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [])
  return null
}
