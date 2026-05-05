import { MagneticButton } from './MagneticButton'

type Props = {
  whatsappE164: string
  isOpen: boolean
}

export function CtaSection({ whatsappE164, isOpen }: Props) {
  const phoneDigits = whatsappE164.replace(/\D/g, '')
  const whatsappHref = `https://wa.me/${phoneDigits}`
  const phoneHref = `tel:+${phoneDigits}`
  const phoneLabel = phoneDigits

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
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            disabled={!isOpen}
            className="rounded-full bg-[#25D366] px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_60px_rgba(37,211,102,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
            onClick={() => {
              if (!isOpen) return
              window.open(whatsappHref, '_blank', 'noopener,noreferrer')
            }}
          >
            WhatsApp
          </MagneticButton>
          <MagneticButton
            disabled={!isOpen}
            className="rounded-full border border-teranga-gold/35 bg-white/5 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-teranga-paper transition hover:border-teranga-gold/60 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            onClick={() => {
              if (!isOpen) return
              window.location.href = phoneHref
            }}
          >
            Appeler {phoneLabel}
          </MagneticButton>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.25em] text-white/35">
          Numéro direct du restaurant: {phoneLabel}
        </p>
      </div>
    </section>
  )
}
