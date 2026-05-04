import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const imgA =
  'https://images.unsplash.com/photo-1665332305771-e49a5dd5ba80?auto=format&fit=crop&w=900&q=80'
const imgB =
  'https://images.unsplash.com/photo-1626266799523-941311ea2273?auto=format&fit=crop&w=900&q=80'

export function ImmersionSection() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return () => ScrollTrigger.getAll().forEach((t) => t.kill())
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector('[data-imm-text]'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%' },
        },
      )
      gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-imm-mask]')).forEach((mask, i) => {
        gsap.fromTo(
          mask,
          { clipPath: 'inset(12% 10% 12% 10% round 32px)', y: 40, opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 32px)',
            y: 0,
            opacity: 1,
            duration: 1.1,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: mask, start: 'top 80%' },
          },
        )
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="histoire"
      ref={root}
      className="relative overflow-hidden border-t border-white/5 bg-[#100c0a] py-24 md:py-32"
    >
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-teranga-clay/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-teranga-gold/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-10">
        <div data-imm-text>
          <p className="text-xs uppercase tracking-[0.35em] text-teranga-gold/90">Immersion</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-teranga-paper md:text-5xl">
            Une cuisine de partage, ancrée dans le terroir
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/60 md:text-base">
            Le thiéb, le yassa, les marinades patientes : tout est affaire de temps, d’épices
            équilibrées et de gestes transmis. Chez Tacko delices, on célèbre la générosité — la
            vraie — celle qui nourrit et rassemble.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
            <span className="rounded-full border border-white/10 px-4 py-2">Riz parfumé</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Poisson du jour</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Marché local</span>
          </div>
        </div>

        <div className="grid gap-5">
          <figure data-imm-mask className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <img src={imgA} alt="Table dressée" className="h-full w-full object-cover" loading="lazy" />
          </figure>
          <figure
            data-imm-mask
            className="ml-auto w-[88%] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl md:w-[92%]"
          >
            <img src={imgB} alt="Riz et légumes" className="h-full w-full object-cover" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  )
}
