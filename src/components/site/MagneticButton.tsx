import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
} from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  strength?: number
}

export function MagneticButton({ children, className, strength = 0.28, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(min-width: 1024px)')
    if (!mq.matches) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    }
    const reset = () => {
      el.style.transform = ''
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', reset)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', reset)
    }
  }, [strength])

  return (
    <button ref={ref} type="button" className={className} {...rest}>
      {children}
    </button>
  )
}
