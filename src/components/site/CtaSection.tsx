import { MagneticButton } from './MagneticButton'

type Props = {
  whatsappE164: string
  isOpen: boolean
}

export function CtaSection({ whatsappE164, isOpen }: Props) {
  const href = `https://wa.me/${whatsappE164.replace(/\D/g, '')}`

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/5 bg-[#0c0907] py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(196,92,58,0.2),transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
        <p className="text-xs uppercase tracking-[0.35em] text-teranga-gold/90">Commander</p>
        <h2 className="mt-4 font-display text-4xl text-teranga-paper md:text-5xl">Une question ? Une envie ?</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
          Écrivez-nous sur WhatsApp pour commander le plat du jour ou demander une fourchette horaire.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <MagneticButton
            disabled={!isOpen}
            className="rounded-full bg-[#25D366] px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_60px_rgba(37,211,102,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
            onClick={() => {
              if (!isOpen) return
              window.open(href, '_blank', 'noopener,noreferrer')
            }}
          >
            WhatsApp
          </MagneticButton>
        </div>
        <p className="mt-8 text-xs text-white/35">
          Numéro WhatsApp géré depuis l’admin — format international sans « + » (ex. 33612345678).
        </p>
      </div>
    </section>
  )
}
