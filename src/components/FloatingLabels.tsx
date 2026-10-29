const labels = [
  { text: 'Backend Systems', position: 'top-[6%] left-[1%]', delay: '0s', dot: 'bg-electric' },
  { text: 'AI Applications', position: 'top-[26%] right-0', delay: '-2.4s', dot: 'bg-violet' },
  { text: 'Full Stack', position: 'bottom-[7%] left-[9%]', delay: '-4.6s', dot: 'bg-cyan-glow' },
]

/**
 * Decorative labels around the globe. They reflect stated interests only and
 * do not represent live data or real locations. Place inside a square,
 * relatively positioned wrapper the same size as the globe.
 */
export default function FloatingLabels() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {labels.map((l) => (
        <span
          key={l.text}
          className={`float-y absolute ${l.position} inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/50 px-3 py-1.5 text-[0.65rem] tracking-wide text-slate-300 shadow-[0_0_24px_rgb(56_189_248/0.12)] backdrop-blur-md sm:text-xs`}
          style={{ animationDelay: l.delay }}
        >
          <span className={`size-1.5 rounded-full ${l.dot}`} />
          {l.text}
        </span>
      ))}
    </div>
  )
}
