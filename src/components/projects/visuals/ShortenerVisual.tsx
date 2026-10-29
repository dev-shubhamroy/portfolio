const label = { fontSize: 9, fill: 'rgb(148 163 184)', fontFamily: 'ui-monospace, monospace' }

const HIT_IN = 'M82 92 C106 92 108 48 132 48'
const HIT_OUT = 'M204 48 C228 48 226 92 248 92'
const MISS_IN = 'M82 108 C106 108 108 152 132 152'
const MISS_OUT = 'M204 152 C228 152 226 108 248 108'

const packet = (d: string, dur: number, delay: number, color: string) => (
  <circle
    key={`${d}-${delay}`}
    r="2.4"
    fill={color}
    className="travel"
    style={{ offsetPath: `path('${d}')`, '--dur': `${dur}s`, '--delay': `${delay}s` } as React.CSSProperties}
  />
)

/** Decorative: request flow with a Redis cache hit and a PostgreSQL fallback. Not a screenshot. */
export default function ShortenerVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden>
      {/* client */}
      <rect x="18" y="80" width="64" height="40" rx="10" fill="#0a1020" stroke="rgb(255 255 255 / 0.18)" />
      <rect x="30" y="94" width="40" height="5" rx="2.5" fill="rgb(255 255 255 / 0.3)" />
      <rect x="30" y="104" width="24" height="5" rx="2.5" fill="rgb(255 255 255 / 0.14)" />
      <text x="34" y="138" {...label}>Client</text>

      {/* Redis */}
      <rect x="132" y="28" width="72" height="40" rx="10" fill="rgb(56 189 248 / 0.08)" stroke="#38bdf8" />
      <text x="152" y="52" {...label} fill="#7dd3fc">Redis</text>
      {/* PostgreSQL */}
      <rect x="132" y="132" width="72" height="40" rx="10" fill="rgb(139 92 246 / 0.08)" stroke="#8b5cf6" />
      <text x="140" y="156" {...label} fill="#c4b5fd">PostgreSQL</text>

      {/* redirect */}
      <rect x="248" y="80" width="56" height="40" rx="10" fill="#0a1020" stroke="rgb(255 255 255 / 0.18)" />
      <path d="M262 100 H288 M281 94 L288 100 L281 106" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="252" y="138" {...label}>Redirect</text>

      {/* cache hit path */}
      <path className="flow" d={HIT_IN} stroke="#38bdf8" strokeWidth="1.4" />
      <path className="flow" d={HIT_OUT} stroke="#38bdf8" strokeWidth="1.4" />
      <text x="96" y="64" {...label} fill="#7dd3fc">hit</text>
      {/* cache miss, fall back to the database */}
      <path className="flow" d={MISS_IN} stroke="#8b5cf6" strokeWidth="1.4" opacity="0.8" />
      <path className="flow" d={MISS_OUT} stroke="#8b5cf6" strokeWidth="1.4" opacity="0.8" />
      <path className="flow" d="M168 132 V68" stroke="rgb(255 255 255 / 0.3)" strokeWidth="1" />
      <text x="96" y="168" {...label} fill="#c4b5fd">miss</text>

      {/* requests: frequent cache hits, occasional database round trips */}
      {packet(HIT_IN, 2.2, 0, '#7dd3fc')}
      {packet(HIT_OUT, 2.2, 1.1, '#7dd3fc')}
      {packet(HIT_IN, 2.2, 2.2, '#7dd3fc')}
      {packet(HIT_OUT, 2.2, 3.3, '#7dd3fc')}
      {packet(MISS_IN, 3.2, 1, '#c4b5fd')}
      {packet(MISS_OUT, 3.2, 4.4, '#c4b5fd')}

      <circle className="node-pulse" cx="168" cy="100" r="3" fill="#38bdf8" />
    </svg>
  )
}
