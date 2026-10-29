import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { makeStars } from '../utils/stars'

const starsNear = makeStars(26, 11, 'rgb(186 230 253 / 0.9)', 2)
const starsFar = makeStars(40, 29, 'rgb(199 210 254 / 0.55)', 1.4)

/**
 * Layered CSS background for the hero: grid, spotlight behind the Earth, stars
 * with slow twinkle and optional mouse parallax. No canvas, no per-frame React work.
 */
export default function HeroBackdrop() {
  const near = useRef<HTMLDivElement>(null)
  const far = useRef<HTMLDivElement>(null)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(pointer: fine)')

  useEffect(() => {
    if (reduced || !finePointer) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5
        const y = e.clientY / window.innerHeight - 0.5
        if (near.current) near.current.style.translate = `${x * -18}px ${y * -18}px`
        if (far.current) far.current.style.translate = `${x * -8}px ${y * -8}px`
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduced, finePointer])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: 'linear-gradient(to bottom, #000 72%, transparent)' }}
    >
      {/* spotlight behind the Earth: below the text on mobile, right column on desktop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_32%_at_50%_80%,rgb(99_102_241/0.22),rgb(56_189_248/0.08)_50%,transparent_75%)] lg:bg-[radial-gradient(ellipse_42%_62%_at_74%_50%,rgb(99_102_241/0.24),rgb(56_189_248/0.09)_45%,transparent_72%)]" />
      <div className="absolute -top-48 right-[-15%] size-[40rem] rounded-full bg-violet/10 blur-[150px]" />
      <div className="absolute bottom-[-14rem] left-[-12%] size-[34rem] rounded-full bg-electric/10 blur-[150px]" />

      {/* stars: two parallax layers, each twinkling slowly out of phase */}
      <div ref={far} className="absolute -inset-5 transition-[translate] duration-700 ease-out">
        <div
          className="twinkle-slow absolute inset-0"
          style={{ backgroundImage: starsFar }}
        />
      </div>
      <div ref={near} className="absolute -inset-5 transition-[translate] duration-700 ease-out">
        <div
          className="twinkle absolute inset-0"
          style={{ backgroundImage: starsNear }}
        />
      </div>

      {/* soft transition from the text column into the globe area */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950/30 lg:bg-gradient-to-r lg:from-ink-950/70 lg:via-ink-950/10 lg:to-transparent" />
    </div>
  )
}
