import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { makeStars } from '../utils/stars'

const stars = makeStars(34, 101, 'rgb(186 230 253 / 0.8)', 1.8)

/**
 * Fixed, page-wide backdrop behind every section: slowly drifting ambient
 * lights (plain gradients, no blur filters), a fine grid with a coordinate
 * ruler, sparse twinkling stars, and a cursor-following light on desktop.
 * Only transforms and opacity animate, and it never receives pointer input.
 */
export default function PageAtmosphere() {
  const light = useRef<HTMLDivElement>(null)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const followCursor = finePointer && !reduced

  useEffect(() => {
    if (!followCursor) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (light.current) light.current.style.translate = `${e.clientX - 360}px ${e.clientY - 360}px`
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [followCursor])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="ambient-a absolute -top-[10%] -left-[25%] size-[80vmax] rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(99 102 241 / 0.16), transparent 62%)' }}
      />
      <div
        className="ambient-b absolute -right-[25%] -bottom-[20%] size-[80vmax] rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(56 189 248 / 0.11), transparent 62%)' }}
      />
      <div
        className="ambient-c absolute top-[35%] left-[30%] hidden size-[50vmax] rounded-full sm:block"
        style={{ background: 'radial-gradient(circle, rgb(139 92 246 / 0.09), transparent 62%)' }}
      />

      <div className="page-grid absolute inset-0" />
      <div className="ruler-left absolute inset-y-0 left-3 hidden w-2 lg:block" />
      <div className="twinkle-slow absolute inset-0" style={{ backgroundImage: stars }} />

      {followCursor && (
        <div
          ref={light}
          className="cursor-light absolute top-0 left-0 size-[45rem] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgb(56 189 248 / 0.07), rgb(139 92 246 / 0.04) 40%, transparent 68%)',
          }}
        />
      )}
    </div>
  )
}
