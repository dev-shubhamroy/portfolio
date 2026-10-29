/** Decorative: abstract retail interface with AI-network links. Not a screenshot. */
export default function RetailVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="rv-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#8b5cf6" />
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
      {/* product tiles */}
      {[84, 144, 204].map((x, i) => (
        <g key={x}>
          <rect x={x} y="54" width="52" height="58" rx="8" fill="rgb(255 255 255 / 0.03)" stroke={i === 1 ? '#38bdf8' : 'rgb(255 255 255 / 0.1)'} />
          <rect x={x + 8} y="62" width="36" height="24" rx="5" fill="rgb(56 189 248 / 0.12)" />
          <rect x={x + 8} y="93" width="28" height="4" rx="2" fill="rgb(255 255 255 / 0.25)" />
          <rect x={x + 8} y="101" width="18" height="4" rx="2" fill="rgb(255 255 255 / 0.12)" />
        </g>
      ))}
      <rect x="264" y="54" width="30" height="58" rx="8" fill="rgb(255 255 255 / 0.02)" stroke="rgb(255 255 255 / 0.06)" />
      {/* assistant panel */}
      <rect x="84" y="126" width="210" height="48" rx="10" fill="rgb(139 92 246 / 0.08)" stroke="rgb(139 92 246 / 0.4)" />
      <rect x="96" y="138" width="110" height="5" rx="2.5" fill="rgb(255 255 255 / 0.3)" />
      <rect x="96" y="150" width="150" height="5" rx="2.5" fill="rgb(255 255 255 / 0.14)" />
      <rect x="96" y="160" width="70" height="5" rx="2.5" fill="rgb(255 255 255 / 0.14)" />
      {/* AI links from the assistant to the tiles */}
      <path className="flow" d="M170 126 V112" stroke="#38bdf8" strokeWidth="1.2" />
      <path className="flow" d="M120 126 C112 120 108 118 110 112" stroke="#8b5cf6" strokeWidth="1.2" />
      <path className="flow" d="M230 126 C238 120 236 118 230 112" stroke="#8b5cf6" strokeWidth="1.2" />
      <circle className="node-pulse" cx="170" cy="119" r="3" fill="#38bdf8" />
      <circle className="node-pulse" style={{ animationDelay: '-1.2s' }} cx="113" cy="119" r="2.5" fill="#8b5cf6" />
      <circle className="node-pulse" style={{ animationDelay: '-2.4s' }} cx="232" cy="119" r="2.5" fill="#8b5cf6" />
      <circle className="node-pulse" cx="278" cy="150" r="4" fill="url(#rv-accent)" />
    </svg>
  )
}
