const FEATURE = 'M80 100 C110 100 110 52 140 52 H210 C240 52 240 100 268 100'
const JOB = 'M120 100 C150 100 150 148 180 148 H240'
const MAIN = 'M20 100 H300'

const mono = { fontSize: 9, fill: 'rgb(148 163 184)', fontFamily: 'ui-monospace, monospace' }

const dot = (d: string, dur: number, delay: number, color: string) => (
  <circle
    key={`${d}-${delay}`}
    r="2.4"
    fill={color}
    className="travel"
    style={{ offsetPath: `path('${d}')`, '--dur': `${dur}s`, '--delay': `${delay}s` } as React.CSSProperties}
  />
)

/** Decorative: a branching worktree graph with a supervised job marker. Not a screenshot. */
export default function BranchVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden>
      {/* faint ruled lines, terminal-like */}
      {[40, 70, 130, 160, 190].map((y) => (
        <line key={y} x1="14" y1={y} x2="306" y2={y} stroke="rgb(255 255 255 / 0.035)" />
      ))}

      {/* main line */}
      <line x1="20" y1="100" x2="300" y2="100" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.5" />
      {/* branches */}
      <path d={FEATURE} stroke="#22d3ee" strokeWidth="1.5" opacity="0.45" />
      <path className="flow" d={FEATURE} stroke="#22d3ee" strokeWidth="1.5" />
      <path d={JOB} stroke="#38bdf8" strokeWidth="1.5" opacity="0.45" />
      <path className="flow" d={JOB} stroke="#38bdf8" strokeWidth="1.5" />

      {/* commits flowing along the lines */}
      {dot(MAIN, 7, 0, '#e2e8f0')}
      {dot(FEATURE, 5, 1, '#67e8f9')}
      {dot(FEATURE, 5, 3.5, '#67e8f9')}
      {dot(JOB, 4.5, 0.5, '#7dd3fc')}

      {/* commits on main */}
      {[36, 80, 120, 200, 268].map((x) => (
        <circle key={x} cx={x} cy="100" r="5" fill="#070912" stroke="rgb(255 255 255 / 0.5)" strokeWidth="1.5" />
      ))}
      {/* commits on branches */}
      <circle cx="140" cy="52" r="4.5" fill="#070912" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="210" cy="52" r="4.5" fill="#070912" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="180" cy="148" r="4.5" fill="#070912" stroke="#38bdf8" strokeWidth="1.5" />

      {/* a running job at the end of the lower branch */}
      <circle className="node-pulse" cx="240" cy="148" r="9" fill="rgb(56 189 248 / 0.25)" />
      <rect x="234" y="142" width="12" height="12" rx="3" fill="#38bdf8" />
      <path d="M239 145.5 L243.5 148 L239 150.5 Z" fill="#070912" />

      <text x="20" y="124" {...mono}>main</text>
      <text x="140" y="40" {...mono}>worktree</text>
      <text x="180" y="170" {...mono}>job</text>
      <rect className="blink" x="203" y="162" width="5" height="9" fill="#67e8f9" opacity="0.8" />
    </svg>
  )
}
