import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { formatFcfa } from '../../lib/format'
import type { Dish } from '../../types/restaurant'

gsap.registerPlugin(ScrollTrigger)

type Props = { dishes: Dish[] }

export function DailyDishesSection({ dishes }: Props) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cards = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-dish-card]'))
    if (reduced) {
      gsap.set(cards, { opacity: 1, y: 0 })
      return () => ScrollTrigger.getAll().forEach((t) => t.kill())
    }
    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        const img = card.querySelector('[data-dish-img]') as HTMLElement | null
        gsap.fromTo(
          card,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none none' },
          },
        )
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: 8 },
            {
              yPercent: -8,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })
    }, el)
    return () => ctx.revert()
  }, [dishes])

  return (
    <section
      id="plats"
      ref={root}
      className="relative border-t border-white/5 bg-teranga-night py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-teranga-gold/90">Aujourd’hui</p>
          <h2 className="mt-3 font-display text-4xl text-teranga-paper md:text-5xl">Plats du jour</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
            Une ou deux signatures, préparées comme à la maison. Pas de carte longue : le bon geste,
            les bons produits, la bonne chaleur.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10">
          {dishes.map((d) => (
            <article
              key={d.id}
              data-dish-card
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  data-dish-img
                  src={d.imageUrl}
                  alt={d.name}
                  className="h-[115%] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-teranga-night via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <h3 className="font-display text-3xl text-teranga-paper md:text-[2.1rem]">{d.name}</h3>
                  <span className="shrink-0 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-medium text-teranga-gold backdrop-blur-md">
                    {formatFcfa(d.price)}
                  </span>
                </div>
              </div>
              <p className="px-6 py-6 text-sm leading-relaxed text-white/65">{d.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
