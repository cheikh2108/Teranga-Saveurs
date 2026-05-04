import { useCallback, useState } from 'react'
import { usePublicRestaurant } from '../hooks/usePublicRestaurant'
import { Loader } from '../components/site/Loader'
import { CustomCursor } from '../components/site/CustomCursor'
import { SiteNav } from '../components/site/SiteNav'
import { ClosedOverlay } from '../components/site/ClosedOverlay'
import { HeroSection } from '../components/site/HeroSection'
import { DailyDishesSection } from '../components/site/DailyDishesSection'
import { ImmersionSection } from '../components/site/ImmersionSection'
import { ReviewsSection } from '../components/site/ReviewsSection'
import { CtaSection } from '../components/site/CtaSection'

export function HomePage() {
  const { data, error, loading, reload } = usePublicRestaurant()
  const [introDone, setIntroDone] = useState(false)

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const showShell = introDone && !loading && data && !error

  return (
    <>
      {!introDone ? <Loader onDone={() => setIntroDone(true)} /> : null}
      {introDone ? <CustomCursor /> : null}

      {!introDone ? null : error ? (
        <div className="flex min-h-screen items-center justify-center bg-teranga-night px-6 text-sm text-white/60">
          <div className="max-w-md text-center">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => reload()}
              className="mt-6 rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.2em] text-white/85 transition hover:border-teranga-gold/50"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : loading || !data ? (
        <div className="flex min-h-screen items-center justify-center bg-teranga-night text-sm text-white/50">
          <p className="animate-pulse">Chargement…</p>
        </div>
      ) : null}

      {showShell ? (
        <>
          <SiteNav isOpen={data.isOpen} />
          <ClosedOverlay active={!data.isOpen} />
          <main className={!data.isOpen ? 'pointer-events-none opacity-40 saturate-50' : ''}>
            <HeroSection
              heroImageUrl={data.heroImageUrl}
              isOpen={data.isOpen}
              onReserve={scrollToContact}
            />
            <DailyDishesSection dishes={data.dishes} />
            <ImmersionSection />
            <ReviewsSection />
            <CtaSection whatsappE164={data.whatsappE164} isOpen={data.isOpen} />
          </main>
          <footer className="border-t border-white/5 bg-black py-10 text-center text-xs text-white/40">
            <p className="mb-2 uppercase tracking-widest text-teranga-gold/80">Teranga Saveurs</p>
            <p className="tracking-wide">L'âme de la gastronomie sénégalaise, savourée à chaque bouchée.</p>
            <p className="mt-6 opacity-60">© {new Date().getFullYear()} Teranga Saveurs. Tous droits réservés.</p>
          </footer>
        </>
      ) : null}
    </>
  )
}
