const link = (d: string, delay: number, color: string) => (
  <circle
    r="2.2"
    fill={color}
    className="travel"
    style={{ offsetPath: `path('${d}')`, '--dur': '3.4s', '--delay': `${delay}s` } as React.CSSProperties}
  />
)

const links = [
  { d: 'M170 126 V112', delay: 0, color: '#7dd3fc' },
  { d: 'M120 126 C112 120 108 118 110 112', delay: 1.1, color: '#c4b5fd' },
  { d: 'M230 126 C238 120 236 118 230 112', delay: 2.2, color: '#c4b5fd' },
]

/** Decorative: abstract retail interface with AI-network links. Not a screenshot. */
export default function RetailVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="rv-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="rv-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      {/* app window */}
      <rect x="14" y="14" width="292" height="172" rx="14" fill="#0a1020" stroke="rgb(255 255 255 / 0.1)" />
      <circle cx="30" cy="29" r="2.5" fill="rgb(255 255 255 / 0.25)" />
      <circle cx="40" cy="29" r="2.5" fill="rgb(255 255 255 / 0.25)" />
      <circle cx="50" cy="29" r="2.5" fill="rgb(255 255 255 / 0.25)" />
      <line x1="14" y1="42" x2="306" y2="42" stroke="rgb(255 255 255 / 0.08)" />
      {/* sidebar */}
      {[56, 72, 88].map((y, i) => (
        <rect key={y} x="26" y={y} width={i === 0 ? 34 : 28} height="7" rx="3.5" fill={i === 0 ? 'url(#rv-accent)' : 'rgb(255 255 255 / 0.12)'} />
      ))}
      {/* product tiles, highlighted in turn */}
      {[84, 144, 204].map((x, i) => (
        <g key={x}>
          <rect x={x} y="54" width="52" height="58" rx="8" fill="rgb(255 255 255 / 0.03)" stroke="rgb(255 255 255 / 0.1)" />
          <rect x={x + 8} y="62" width="36" height="24" rx="5" fill="rgb(56 189 248 / 0.12)" />
          <rect x={x + 8} y="93" width="28" height="4" rx="2" fill="rgb(255 255 255 / 0.25)" />
          <rect x={x + 8} y="101" width="18" height="4" rx="2" fill="rgb(255 255 255 / 0.12)" />
          <rect
            className="seq"
            style={{ '--delay': `${i * 3 - 3}s` } as React.CSSProperties}
            x={x}
            y="54"
            width="52"
            height="58"
            rx="8"
            fill="rgb(56 189 248 / 0.1)"
            stroke="#38bdf8"
          />
        </g>
      ))}
      <rect x="264" y="54" width="30" height="58" rx="8" fill="rgb(255 255 255 / 0.02)" stroke="rgb(255 255 255 / 0.06)" />
      {/* assistant panel */}
      <rect x="84" y="126" width="210" height="48" rx="10" fill="rgb(139 92 246 / 0.08)" stroke="rgb(139 92 246 / 0.4)" />
      <rect x="96" y="138" width="110" height="5" rx="2.5" fill="rgb(255 255 255 / 0.3)" />
      <rect x="96" y="150" width="150" height="5" rx="2.5" fill="rgb(255 255 255 / 0.14)" />
      <rect x="96" y="160" width="70" height="5" rx="2.5" fill="rgb(255 255 255 / 0.14)" />
      {/* AI links from the assistant to the tiles */}
      {links.map(({ d }) => (
        <path key={d} className="flow" d={d} stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
      ))}
      {links.map(({ d, delay, color }) => (
        <g key={d}>{link(d, delay, color)}</g>
      ))}
      <circle className="node-pulse" cx="170" cy="119" r="3" fill="#38bdf8" />
      <circle className="node-pulse" style={{ animationDelay: '-1.2s' }} cx="113" cy="119" r="2.5" fill="#8b5cf6" />
      <circle className="node-pulse" style={{ animationDelay: '-2.4s' }} cx="232" cy="119" r="2.5" fill="#8b5cf6" />
      {/* assistant "thinking" dots */}
      {[266, 274, 282].map((cx, i) => (
        <circle key={cx} className="node-pulse" style={{ animationDelay: `${-i * 0.5}s`, animationDuration: '1.8s' }} cx={cx} cy="150" r="2.2" fill="url(#rv-accent)" />
      ))}
      {/* soft scan line across the window */}
      <g className="scan" style={{ transformBox: 'view-box' }}>
        <rect x="16" y="44" width="288" height="26" fill="url(#rv-scan)" />
      </g>
    </svg>
  )
}
