import type { CSSProperties } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/**
 * Mechanical engineering -> problem solving -> software engineering, as one
 * 20-second sequence (timing lives in styles/transformation.css):
 *
 *   1. a gear-and-shaft drawing is drafted line by line and turns one tooth
 *   2. the tooth tips lift off as points, line up in a column, then fan out
 *   3. they land as nodes of a network; the shaft's energy feeds its centre
 *   4. connections are drawn, light travels along them, the network holds
 *
 * The drawing never disappears completely: it stays as a faint ghost under the
 * network. Everything is original SVG + CSS. JavaScript only decides whether to
 * show the static final composition (reduced motion).
 */

const BP = 'rgb(125 211 252 / 0.55)'
const BP_SOFT = 'rgb(125 211 252 / 0.28)'
const MONO = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const

// --- mechanism geometry -------------------------------------------------
const GEAR = { cx: 84, cy: 120, outer: 42, inner: 34, teeth: 12 }
const PINION = { cx: 142, cy: 120, outer: 22, inner: 16, teeth: 8 }

function gearPath({ cx, cy, outer, inner, teeth }: typeof GEAR) {
  const step = (Math.PI * 2) / teeth
  const pts: string[] = []
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    for (const [da, r] of [
      [0, inner],
      [step * 0.12, outer],
      [step * 0.42, outer],
      [step * 0.54, inner],
    ] as const) {
      pts.push(`${(cx + Math.cos(a + da) * r).toFixed(1)} ${(cy + Math.sin(a + da) * r).toFixed(1)}`)
    }
  }
  return `M${pts.join(' L')} Z`
}

/** Centre of each tooth tip, which is where a point is released. */
function tipPoints({ cx, cy, outer, teeth }: typeof GEAR) {
  const step = (Math.PI * 2) / teeth
  return Array.from({ length: teeth }, (_, i) => {
    const a = i * step + step * 0.27
    return { x: cx + Math.cos(a) * outer, y: cy + Math.sin(a) * outer }
  })
}

// --- network geometry ---------------------------------------------------
const SYS = { x: 250, y: 130 }
const RING_R = 50
const LEAF_R = 92
const BUS_X = 182

const polar = (r: number, deg: number) => ({
  x: SYS.x + Math.cos((deg * Math.PI) / 180) * r,
  y: SYS.y + Math.sin((deg * Math.PI) / 180) * r,
})
const angles = [0, 1, 2, 3, 4, 5].map((k) => -90 + 60 * k)
const ring = angles.map((a) => polar(RING_R, a))
const leaf = angles.map((a) => polar(LEAF_R, a))

type Node = { x: number; y: number; tone: 'blue' | 'violet' }
const nodes: Node[] = [
  ...ring.map((p) => ({ ...p, tone: 'blue' as const })),
  ...leaf.map((p) => ({ ...p, tone: 'violet' as const })),
].sort((a, b) => a.y - b.y || a.x - b.x)

// Pair tooth tips with nodes top-to-bottom so the paths flow without crossing.
const tips = tipPoints(GEAR).sort((a, b) => a.y - b.y || a.x - b.x)
const gearPoints = tips.map((tip, i) => {
  const node = nodes[i]
  const bus = { x: BUS_X, y: 36 + (i * 188) / (tips.length - 1) }
  return {
    ...tip,
    tone: node.tone,
    dx: node.x - tip.x,
    dy: node.y - tip.y,
    mx: bus.x - tip.x,
    my: bus.y - tip.y,
    delay: i * 0.1,
  }
})

const pinionPoints = tipPoints({ ...PINION, teeth: PINION.teeth } as typeof GEAR).map((tip, i) => ({
  ...tip,
  dx: SYS.x - tip.x + Math.cos(i) * 3,
  dy: SYS.y - tip.y + Math.sin(i) * 3,
  delay: 0.2 + i * 0.12,
}))

const edges = [
  ...ring.map((p, k) => ({ a: SYS, b: p, tone: 'blue', delay: k * 0.12 })),
  ...ring.map((p, k) => ({ a: p, b: leaf[k], tone: 'violet', delay: 0.7 + k * 0.12 })),
  ...ring.map((p, k) => ({ a: p, b: ring[(k + 1) % 6], tone: 'faint', delay: 1.4 + k * 0.1 })),
]

const pulses = [0, 2, 3, 5].map((k, i) => ({
  d: `M${SYS.x} ${SYS.y} L${ring[k].x.toFixed(1)} ${ring[k].y.toFixed(1)} L${leaf[k].x.toFixed(1)} ${leaf[k].y.toFixed(1)}`,
  delay: i * 1.1,
}))

const toneFill = { blue: '#38bdf8', violet: '#c4b5fd' } as const
const toneStroke = { blue: '#38bdf8', violet: '#8b5cf6', faint: 'rgb(255 255 255 / 0.28)' } as const

const GEAR_PATH = gearPath(GEAR)
const PINION_PATH = gearPath(PINION as typeof GEAR)

function Dimension({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g stroke={BP} strokeWidth="0.8" className="xf-fade" style={{ '--bd': '1.4s' } as CSSProperties}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <path d={`M${x1} ${y} l5 -2.5 v5 z M${x2} ${y} l-5 -2.5 v5 z`} fill={BP} />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} />
      <text x={(x1 + x2) / 2} y={y - 4} textAnchor="middle" fontSize="7.5" fill={BP} stroke="none" style={MONO}>
        {label}
      </text>
    </g>
  )
}

const stages = ['Mechanical Engineering', 'Problem Solving', 'Software Engineering']

export default function TransitionDiagram() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div className="xf" data-static={reduced ? 'true' : undefined}>
      <div className="pointer-events-none aspect-[360/260]">
        <svg viewBox="0 0 360 260" className="h-full w-full" fill="none" aria-hidden>
          {/* ---------- stage 1: the drawing ---------- */}
          <g className="xf-gate-bp">
            <g className="xf-turn" style={{ '--turn': `${360 / GEAR.teeth}deg` } as CSSProperties}>
              <path className="xf-draw" pathLength={1} d={GEAR_PATH} stroke={BP} strokeWidth="1" style={{ '--bd': '0s' } as CSSProperties} />
              <circle className="xf-draw" pathLength={1} cx={GEAR.cx} cy={GEAR.cy} r="10" stroke={BP} style={{ '--bd': '0.3s' } as CSSProperties} />
              {[0, 90, 180, 270].map((a) => (
                <line key={a} className="xf-draw" pathLength={1} x1={GEAR.cx + 10 * Math.cos((a * Math.PI) / 180)} y1={GEAR.cy + 10 * Math.sin((a * Math.PI) / 180)} x2={GEAR.cx + 22 * Math.cos((a * Math.PI) / 180)} y2={GEAR.cy + 22 * Math.sin((a * Math.PI) / 180)} stroke={BP_SOFT} />
              ))}
            </g>
            <g className="xf-turn" style={{ '--turn': `${-360 / PINION.teeth}deg`, transformOrigin: `${PINION.cx}px ${PINION.cy}px` } as CSSProperties}>
              <path className="xf-draw" pathLength={1} d={PINION_PATH} stroke={BP} strokeWidth="1" style={{ '--bd': '0.5s' } as CSSProperties} />
              <circle className="xf-draw" pathLength={1} cx={PINION.cx} cy={PINION.cy} r="6" stroke={BP} style={{ '--bd': '0.7s' } as CSSProperties} />
            </g>
            <circle className="xf-draw" pathLength={1} cx={GEAR.cx} cy={GEAR.cy} r="37.5" stroke={BP_SOFT} strokeDasharray="3 3" style={{ '--bd': '0.2s' } as CSSProperties} />

            {/* stepped shaft, bearing block and hatching */}
            <path className="xf-draw" pathLength={1} d="M142 113 H200 V107 H234 V133 H200 V127 H142" stroke={BP} strokeWidth="1" style={{ '--bd': '0.9s' } as CSSProperties} />
            <rect className="xf-draw" pathLength={1} x="166" y="98" width="22" height="44" rx="2" stroke={BP} style={{ '--bd': '1.1s' } as CSSProperties} />
            <g className="xf-fade" stroke={BP_SOFT} strokeWidth="0.7" style={{ '--bd': '1.5s' } as CSSProperties}>
              {[0, 6, 12, 18, 24, 30].map((o) => (
                <line key={o} x1={202 + o} y1="133" x2={208 + o} y2="107" />
              ))}
            </g>

            {/* centrelines and dimensions */}
            <g className="xf-fade" stroke={BP_SOFT} strokeDasharray="10 3 2 3" style={{ '--bd': '1.2s' } as CSSProperties}>
              <line x1="30" y1={GEAR.cy} x2="244" y2={GEAR.cy} />
              <line x1={GEAR.cx} y1="68" x2={GEAR.cx} y2="172" />
            </g>
            <Dimension x1={GEAR.cx - GEAR.outer} x2={GEAR.cx + GEAR.outer} y={190} label="Ø" />
            <Dimension x1={PINION.cx} x2={234} y={88} label="L" />

            {/* title block */}
            <g className="xf-fade" stroke={BP} strokeWidth="0.8" style={{ '--bd': '1.8s' } as CSSProperties}>
              <rect x="14" y="226" width="124" height="22" />
              <line x1="74" y1="226" x2="74" y2="248" />
              <line x1="14" y1="237" x2="138" y2="237" />
            </g>
            <text className="xf-fade" x="20" y="235" fontSize="6.5" fill={BP} style={{ ...MONO, '--bd': '1.8s' } as CSSProperties}>MECH. DRAFT</text>
            <text className="xf-fade" x="80" y="235" fontSize="6.5" fill={BP} style={{ ...MONO, '--bd': '1.8s' } as CSSProperties}>SHEET 1</text>
          </g>

          {/* a thin scan line passes over the drawing while it comes alive */}
          <g className="xf-scan">
            <line x1="14" y1="30" x2="14" y2="214" stroke="url(#xf-scan)" strokeWidth="1.2" />
            <rect x="8" y="30" width="12" height="184" fill="url(#xf-scan-glow)" />
          </g>

          <g className="xf-gate-net">
          {/* ---------- stage 3: the network ---------- */}
          {edges.map((e, i) => (
            <line
              key={i}
              className="xf-edge"
              pathLength={1}
              x1={e.a.x}
              y1={e.a.y}
              x2={e.b.x}
              y2={e.b.y}
              stroke={toneStroke[e.tone as keyof typeof toneStroke]}
              strokeWidth={e.tone === 'faint' ? 0.8 : 1.2}
              style={{ '--d': `${e.delay}s` } as CSSProperties}
            />
          ))}

          {nodes.map((n, i) => (
            <circle
              key={i}
              className="xf-node"
              cx={n.x}
              cy={n.y}
              r="7"
              fill={`${toneFill[n.tone]}18`}
              stroke={toneFill[n.tone]}
              strokeWidth="1"
              style={{ '--d': `${0.2 + i * 0.1}s` } as CSSProperties}
            />
          ))}

          <g className="xf-sys">
            <circle cx={SYS.x} cy={SYS.y} r="19" fill="rgb(56 189 248 / 0.1)" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx={SYS.x} cy={SYS.y} r="26" stroke="rgb(56 189 248 / 0.3)" strokeDasharray="2 4" />
            <circle className="node-pulse" cx={SYS.x} cy={SYS.y} r="5" fill="#38bdf8" />
          </g>

          {pulses.map((p, i) => (
            <circle
              key={i}
              className="xf-pulse"
              r="2.4"
              fill="#e0f2fe"
              style={{ offsetPath: `path('${p.d}')`, '--d': `${p.delay}s` } as CSSProperties}
            />
          ))}

          {/* ---------- stage 2: the points that carry the geometry across ---------- */}
          {gearPoints.map((p, i) => (
            <circle
              key={i}
              className="xf-pt"
              cx={p.x}
              cy={p.y}
              r="2.2"
              fill={toneFill[p.tone]}
              style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--mx': `${p.mx}px`, '--my': `${p.my}px`, '--d': `${p.delay}s` } as CSSProperties}
            />
          ))}
          {pinionPoints.map((p, i) => (
            <circle
              key={i}
              className="xf-pt xf-pt-merge"
              cx={p.x}
              cy={p.y}
              r="1.8"
              fill="#22d3ee"
              style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--d': `${p.delay}s` } as CSSProperties}
            />
          ))}
          </g>

          <defs>
            <linearGradient id="xf-scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="0.5" stopColor="#7dd3fc" stopOpacity="0.7" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="xf-scan-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* the three stages, lit in turn by the same timeline */}
      <div className="mt-3">
        <div aria-hidden className="relative h-px bg-white/10">
          <div className="xf-progress absolute inset-0 origin-left bg-gradient-to-r from-electric via-violet to-cyan-glow" />
        </div>
        <ol className="mt-2.5 grid grid-cols-3 gap-2 text-center">
          {stages.map((label, i) => (
            <li
              key={label}
              className={`xf-stage xf-stage-${i + 1} font-mono text-[0.58rem] leading-tight tracking-wide uppercase sm:text-[0.62rem]`}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
