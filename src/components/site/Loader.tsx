import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type Props = { onDone: () => void }

export function Loader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      onDone()
      setVisible(false)
      return
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false)
        onDone()
      },
    })
    tl.fromTo(
      el.querySelectorAll('[data-bar]'),
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.9, stagger: 0.08, ease: 'power3.inOut' },
    )
      .to(el, { opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=0.15')
    return () => {
      tl.kill()
    }
  }, [onDone])

  if (!visible) return null

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-teranga-night"
      aria-hidden
    >
      <p className="font-display text-3xl tracking-wide text-teranga-paper md:text-4xl">Tacko delices</p>
      <div className="mt-8 flex w-[min(18rem,80vw)] gap-1">
        <span data-bar className="h-px flex-1 bg-teranga-moss/90" />
        <span data-bar className="h-px flex-1 bg-teranga-gold/90" />
        <span data-bar className="h-px flex-1 bg-teranga-clay/90" />
      </div>
    </div>
  )
}
