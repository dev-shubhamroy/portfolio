const text = { fontSize: 10, fontFamily: 'ui-monospace, monospace' }

/** Decorative: from mechanical engineering to the software areas I'm focused on. */
export default function TransitionDiagram() {
  return (
    <svg viewBox="0 0 360 260" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="td-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* source node */}
      <rect x="14" y="104" width="104" height="52" rx="12" fill="#0a1020" stroke="rgb(255 255 255 / 0.2)" />
      <text x="28" y="126" {...text} fill="rgb(226 232 240)">Mechanical</text>
      <text x="28" y="142" {...text} fill="rgb(226 232 240)">Engineering</text>

      {/* middle: shared habits */}
      <circle cx="176" cy="130" r="22" fill="rgb(56 189 248 / 0.08)" stroke="#38bdf8" />
      <circle className="node-pulse" cx="176" cy="130" r="4" fill="#38bdf8" />
      <text x="146" y="172" {...text} fill="rgb(148 163 184)">problem solving</text>

      {/* targets */}
      {[
        { y: 28, name: 'Backend' },
        { y: 104, name: 'Full-stack' },
        { y: 180, name: 'AI apps' },
      ].map(({ y, name }) => (
        <g key={name}>
          <rect x="250" y={y} width="96" height="48" rx="12" fill="rgb(139 92 246 / 0.07)" stroke="rgb(139 92 246 / 0.55)" />
          <text x="266" y={y + 29} {...text} fill="#ddd6fe">{name}</text>
        </g>
      ))}

      {/* links */}
      <path d="M118 130 H154" stroke="url(#td-accent)" strokeWidth="1.5" opacity="0.6" />
      <path className="flow" d="M118 130 H154" stroke="url(#td-accent)" strokeWidth="1.5" />
      {[52, 130, 204].map((y) => (
        <g key={y}>
          <path d={`M198 130 C224 130 224 ${y} 250 ${y}`} stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
          <path className="flow" d={`M198 130 C224 130 224 ${y} 250 ${y}`} stroke="#8b5cf6" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  )
}
