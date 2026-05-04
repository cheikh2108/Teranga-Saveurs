type Props = { active: boolean }

export function ClosedOverlay({ active }: Props) {
  if (!active) return null
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-6 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="closed-title"
      aria-describedby="closed-desc"
    >
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-10 text-center shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <p id="closed-title" className="font-display text-3xl text-teranga-paper md:text-4xl">
          Nous sommes fermés
        </p>
        <p id="closed-desc" className="mt-4 text-sm leading-relaxed text-white/65">
          Merci pour votre visite. Le propriétaire peut rouvrir le restaurant depuis le tableau de
          bord admin. Les actions de commande sont désactivées pour éviter les attentes.
        </p>
      </div>
    </div>
  )
}
