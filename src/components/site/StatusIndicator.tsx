type Props = { open: boolean }

export function StatusIndicator({ open }: Props) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {open ? (
          <span
            className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/35 motion-safe:animate-ping"
            aria-hidden
          />
        ) : null}
        <span
          className={`relative block h-2 w-2 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.35)] ${
            open ? 'bg-emerald-400' : 'bg-rose-500'
          }`}
          aria-hidden
        />
      </span>
      {open ? 'Ouvert aujourd’hui' : 'Fermé aujourd’hui'}
    </span>
  )
}
