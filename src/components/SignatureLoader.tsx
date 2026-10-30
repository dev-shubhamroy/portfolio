import { useEffect, useRef, useState } from 'react'

const SHOW_MS = 2300 // when the intro begins to leave
const LEAVE_MS = 550 // fade-out length
const SEEN_KEY = 'sr-intro-seen'

function finishIntro() {
  document.documentElement.setAttribute('data-intro', 'done')
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* storage unavailable: the intro may simply show again next visit */
  }
}

/**
 * A short signature intro, drawn from the portfolio's own imagery: the "SR"
 * mark, an orbit forming around it, a light travelling that orbit, then the
 * Earth appearing as the page takes over.
 *
 * It only runs on a first visit (index.html sets data-intro before first
 * paint, and skips reduced motion and deep links), can be skipped with a
 * button or Escape, never depends on WebGL or the network, and a timer ends
 * it regardless. The page underneath is already rendered, so nothing shifts
 * when it leaves.
 */
export default function SignatureLoader() {
  const [mounted, setMounted] = useState(
    () => document.documentElement.getAttribute('data-intro') === 'active',
  )
  const [leaving, setLeaving] = useState(false)
  const skip = useRef<() => void>(() => {})

  useEffect(() => {
    if (!mounted) return
    let leave = 0
    let remove = 0
    const begin = (delay: number) => {
      window.clearTimeout(leave)
      leave = window.setTimeout(() => {
        setLeaving(true)
        // the hero's own entrance starts as the intro fades
        finishIntro()
        remove = window.setTimeout(() => setMounted(false), LEAVE_MS)
      }, delay)
    }
    begin(SHOW_MS)

    skip.current = () => begin(0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') begin(0)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(leave)
      window.clearTimeout(remove)
      window.removeEventListener('keydown', onKey)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio intro"
      data-leaving={leaving}
      className="intro fixed inset-0 z-[100] grid place-items-center bg-ink-950"
    >
      <div aria-hidden className="intro-glow absolute inset-0" />
      <div aria-hidden className="page-grid absolute inset-0 opacity-70" />

      <svg viewBox="0 0 200 200" className="intro-mark relative size-[min(15rem,62vw)]" aria-hidden fill="none">
        <defs>
          <linearGradient id="intro-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
          <radialGradient id="intro-globe" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#1e3a8a" />
            <stop offset="0.6" stopColor="#0a1020" />
            <stop offset="1" stopColor="#070912" />
          </radialGradient>
        </defs>

        {/* the Earth silhouette arrives after the ring and light */}
        <g className="intro-globe">
          <circle cx="100" cy="100" r="34" fill="url(#intro-globe)" stroke="rgb(56 189 248 / 0.55)" strokeWidth="1" />
          <g stroke="rgb(125 211 252 / 0.28)" strokeWidth="0.6">
            <ellipse cx="100" cy="100" rx="34" ry="12" />
            <ellipse cx="100" cy="100" rx="12" ry="34" />
            <line x1="66" y1="100" x2="134" y2="100" />
          </g>
          <circle cx="100" cy="100" r="34" stroke="rgb(139 92 246 / 0.45)" strokeWidth="2" strokeDasharray="30 190" strokeLinecap="round" />
        </g>

        {/* orbit forms, then a light travels it once */}
        <circle className="intro-ring" cx="100" cy="100" r="72" pathLength={1} stroke="url(#intro-g)" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="86" stroke="rgb(255 255 255 / 0.06)" strokeDasharray="2 5" />
        <g className="intro-orbit">
          <circle cx="100" cy="28" r="3" fill="#e0f2fe" />
          <circle cx="100" cy="28" r="7" fill="#38bdf8" opacity="0.28" />
        </g>

        {/* the monogram, which gives way to the globe */}
        <g className="intro-monogram">
          <rect x="78" y="78" width="44" height="44" rx="12" fill="url(#intro-g)" />
          <text x="100" y="107" textAnchor="middle" fontSize="17" fontWeight="700" fill="#070912" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
            SR
          </text>
        </g>
      </svg>

      <button
        type="button"
        onClick={() => skip.current()}
        autoFocus
        className="intro-skip absolute bottom-8 left-1/2 min-h-11 -translate-x-1/2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 font-mono text-[0.7rem] tracking-widest text-slate-400 uppercase hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
      >
        Skip intro
      </button>
    </div>
  )
}
