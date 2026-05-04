import { useEffect, useState } from 'react'
import gsap from 'gsap'

const reviews = [
  {
    name: 'Aïssatou D.',
    text: 'Comme à Dakar. Le riz est parfumé, le poisson fondant — on revient chaque semaine.',
  },
  {
    name: 'Marc L.',
    text: 'Une découverte. Accueil chaleureux, assiette généreuse, équilibre des épices impeccable.',
  },
  {
    name: 'Fatou K.',
    text: 'Le plat du jour, c’est la surprise du midi. Toujours soigné, toujours authentique.',
  },
]

export function ReviewsSection() {
  const [i, setI] = useState(0)
  const active = reviews[i]

  useEffect(() => {
    const el = document.querySelector('[data-review-active]')
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    gsap.fromTo(el, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' })
  }, [i])

  return (
    <section id="avis" className="border-t border-white/5 bg-teranga-night py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teranga-gold/90">Témoignages</p>
            <h2 className="mt-3 font-display text-4xl text-teranga-paper md:text-5xl">Ils parlent de nous</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Avis précédent"
              onClick={() => setI((v) => (v - 1 + reviews.length) % reviews.length)}
              className="h-11 w-11 rounded-full border border-white/15 text-white/70 transition hover:border-teranga-gold/50 hover:text-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Avis suivant"
              onClick={() => setI((v) => (v + 1) % reviews.length)}
              className="h-11 w-11 rounded-full border border-white/15 text-white/70 transition hover:border-teranga-gold/50 hover:text-white"
            >
              ›
            </button>
          </div>
        </div>

        <article
          key={active.name}
          data-review-active
          className="mt-12 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-14"
        >
          <p className="font-display text-2xl leading-snug text-teranga-paper md:text-3xl">
            “{active.text}”
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.24em] text-teranga-gold/90">{active.name}</p>
        </article>

        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Afficher l’avis ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === i ? 'w-8 bg-teranga-gold' : 'w-2 bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
