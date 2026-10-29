/** Decorative: a branching worktree graph with a supervised job marker. Not a screenshot. */
export default function BranchVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden>
      {/* main line */}
      <line x1="20" y1="100" x2="300" y2="100" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.5" />
      {/* branches */}
      <path d="M80 100 C110 100 110 52 140 52 H210 C240 52 240 100 268 100" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" />
      <path className="flow" d="M80 100 C110 100 110 52 140 52 H210 C240 52 240 100 268 100" stroke="#38bdf8" strokeWidth="1.5" />
      <path d="M120 100 C150 100 150 148 180 148 H240" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
      <path className="flow" d="M120 100 C150 100 150 148 180 148 H240" stroke="#8b5cf6" strokeWidth="1.5" />

      {/* commits on main */}
      {[36, 80, 120, 200, 268].map((x) => (
        <circle key={x} cx={x} cy="100" r="5" fill="#070912" stroke="rgb(255 255 255 / 0.5)" strokeWidth="1.5" />
      ))}
      {/* commits on branches */}
      <circle cx="140" cy="52" r="4.5" fill="#070912" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="210" cy="52" r="4.5" fill="#070912" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="180" cy="148" r="4.5" fill="#070912" stroke="#8b5cf6" strokeWidth="1.5" />

      {/* a running job at the end of the lower branch */}
      <circle className="node-pulse" cx="240" cy="148" r="9" fill="rgb(139 92 246 / 0.25)" />
      <rect x="234" y="142" width="12" height="12" rx="3" fill="#8b5cf6" />
      <path d="M239 145.5 L243.5 148 L239 150.5 Z" fill="#070912" />

      <text x="20" y="124" fontSize="9" fill="rgb(148 163 184)" fontFamily="ui-monospace, monospace">main</text>
      <text x="140" y="40" fontSize="9" fill="rgb(148 163 184)" fontFamily="ui-monospace, monospace">worktree</text>
      <text x="180" y="170" fontSize="9" fill="rgb(148 163 184)" fontFamily="ui-monospace, monospace">job</text>
    </svg>
  )
}
