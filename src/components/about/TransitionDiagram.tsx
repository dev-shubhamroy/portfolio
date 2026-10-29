import type { CSSProperties } from 'react'

const text = { fontSize: 10, fontFamily: 'ui-monospace, monospace' }

const targets = [
  { y: 28, name: 'Backend', cy: 52 },
  { y: 104, name: 'Full-stack', cy: 130 },
  { y: 180, name: 'AI apps', cy: 204 },
]

const pathTo = (cy: number) => `M198 130 C224 130 224 ${cy} 250 ${cy}`

/**
 * Decorative: from mechanical engineering to the software areas I'm focused on.
 * The three targets light up one after another while a pulse travels to each.
 */
export default function TransitionDiagram() {
  return (
    <svg viewBox="0 0 360 260" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="td-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* faint measurement ticks along the bottom, nodding to engineering drawings */}
      {Array.from({ length: 19 }, (_, i) => (
        <line key={i} x1={14 + i * 18} y1="244" x2={14 + i * 18} y2={i % 5 === 0 ? 236 : 240} stroke="rgb(255 255 255 / 0.18)" />
      ))}
      <line x1="14" y1="244" x2="338" y2="244" stroke="rgb(255 255 255 / 0.12)" />

      {/* source node */}
      <rect x="14" y="104" width="104" height="52" rx="12" fill="#0a1020" stroke="rgb(255 255 255 / 0.2)" />
      <text x="28" y="126" {...text} fill="rgb(226 232 240)">Mechanical</text>
      <text x="28" y="142" {...text} fill="rgb(226 232 240)">Engineering</text>

      {/* middle: shared habits */}
      <circle cx="176" cy="130" r="22" fill="rgb(56 189 248 / 0.08)" stroke="#38bdf8" />
      <circle className="node-pulse" cx="176" cy="130" r="4" fill="#38bdf8" />
      <text x="146" y="172" {...text} fill="rgb(148 163 184)">problem solving</text>

      {/* links */}
      <path d="M118 130 H154" stroke="url(#td-accent)" strokeWidth="1.5" opacity="0.6" />
      <path className="flow" d="M118 130 H154" stroke="url(#td-accent)" strokeWidth="1.5" />
      {targets.map(({ cy }) => (
        <g key={cy}>
          <path d={pathTo(cy)} stroke="#8b5cf6" strokeWidth="1.5" opacity="0.45" />
          <path className="flow" d={pathTo(cy)} stroke="#8b5cf6" strokeWidth="1.5" opacity="0.8" />
        </g>
      ))}

      {/* targets, emphasised in sequence */}
      {targets.map(({ y, name }, i) => {
        const delay = { '--delay': `${i * 3}s` } as CSSProperties
        return (
          <g key={name}>
            <rect x="250" y={y} width="96" height="48" rx="12" fill="rgb(139 92 246 / 0.07)" stroke="rgb(139 92 246 / 0.55)" />
            <rect className="seq" style={delay} x="250" y={y} width="96" height="48" rx="12" fill="rgb(139 92 246 / 0.22)" stroke="#c4b5fd" />
            <text x="266" y={y + 29} {...text} fill="#ddd6fe">{name}</text>
          </g>
        )
      })}

      {/* a pulse travels to each target in turn */}
      {targets.map(({ cy }, i) => (
        <circle
          key={cy}
          r="3"
          fill="#c4b5fd"
          className="travel-seq"
          style={{ offsetPath: `path('${pathTo(cy)}')`, '--delay': `${i * 3}s` } as CSSProperties}
        />
      ))}
    </svg>
  )
}
