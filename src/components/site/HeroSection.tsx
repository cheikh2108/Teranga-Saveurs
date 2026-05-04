import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { MagneticButton } from './MagneticButton'

type Props = {
  heroImageUrl: string
  isOpen: boolean
  onReserve: () => void
}

const wordsTitle = ['L’âme', 'du', 'Sénégal']
const wordsSub = ['dans', 'chaque', 'plat']

export function HeroSection({ heroImageUrl, isOpen, onReserve }: Props) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-reveal], [data-reveal-word], [data-reveal-sub], [data-reveal-cta]', { opacity: 1, y: 0, yPercent: 0, rotate: 0 })
        return
      }
      
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-reveal-word]', {
        yPercent: 120,
        rotate: 2,
        opacity: 0,
        duration: 1,
        stagger: 0.06,
      })
        .from(
          '[data-reveal-sub]',
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.05 },
          '-=0.45',
        )
        .from('[data-reveal-cta]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.35')
    }, el)

    return () => {
      ctx.revert() // Le fix crucial pour React 18+ (StrictMode)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40"
    >
      <div className="absolute inset-0">
        <img
          src={heroImageUrl}
          alt=""
          className="h-full w-full scale-105 object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-teranga-night/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-teranga-night via-teranga-night/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,165,116,0.18),transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-teranga-gold drop-shadow-md">
          Restaurant sénégalais
        </p>
        <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] text-teranga-paper drop-shadow-lg">
          <span className="block overflow-hidden">
            {wordsTitle.map((w) => (
              <span key={w} className="mr-[0.2em] inline-block overflow-hidden">
                <span data-reveal data-reveal-word className="inline-block will-change-transform">
                  {w}
                </span>
              </span>
            ))}
          </span>
          <span className="mt-2 block overflow-hidden text-white/85">
            {wordsSub.map((w) => (
              <span key={w} className="mr-[0.18em] inline-block overflow-hidden">
                <span data-reveal data-reveal-sub className="inline-block will-change-transform">
                  {w}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <div data-reveal data-reveal-cta className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton
            disabled={!isOpen}
            onClick={onReserve}
            className="group relative overflow-hidden rounded-full bg-teranga-paper px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-teranga-night transition disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="relative z-10">Commander</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-teranga-gold transition-transform duration-500 group-hover:translate-x-0 group-hover:duration-700" />
          </MagneticButton>
          <a
            href="#plats"
            className="rounded-full border border-white/25 px-7 py-3.5 text-sm uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition hover:border-teranga-gold/60 hover:text-white"
          >
            Voir les plats
          </a>
        </div>
      </div>
    </section>
  )
}
