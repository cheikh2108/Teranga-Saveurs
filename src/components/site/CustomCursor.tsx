import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    if (!mq.matches) return

    document.body.classList.add('use-custom-cursor')

    let raf = 0
    const pos = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const move = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      const d = dot.current
      const r = ring.current
      if (d) {
        d.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      }
      if (r) {
        r.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      document.body.classList.remove('use-custom-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-10 w-10 rounded-full border border-white/25 lg:block"
        aria-hidden
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-1.5 w-1.5 rounded-full bg-teranga-gold lg:block"
        aria-hidden
      />
    </>
  )
}
