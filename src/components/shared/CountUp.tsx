import { useEffect, useRef, useState } from 'react'

/** Extracts the leading numeric portion of a display value like "12,450" or "3–5 Days" so it can be counted up; the rest of the string is preserved as a suffix/prefix. */
function parseNumeric(value: string): { prefix: string; number: number | null; suffix: string } {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/)
  if (!match) return { prefix: '', number: null, suffix: value }
  const [, prefix, digits, suffix] = match
  return { prefix, number: Number(digits.replace(/,/g, '')), suffix }
}

export function CountUp({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const { prefix, number, suffix } = parseNumeric(value)
  const [display, setDisplay] = useState(number === null ? value : 0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (number === null) return
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(number)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(number * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [number, durationMs])

  return (
    <span ref={ref}>
      {prefix}
      {number === null ? display : display.toLocaleString()}
      {suffix}
    </span>
  )
}
