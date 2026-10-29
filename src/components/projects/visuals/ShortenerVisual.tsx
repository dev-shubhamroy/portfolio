import { Mono, Pulse } from '../../diagram/primitives'
import { palette, toneColor, type Tone } from '../../diagram/tokens'

// Sequence diagram of the redirect handler in server.js: Redis is checked
// first, PostgreSQL is the fallback, and the result is cached for an hour.
const LIFELINES = [
  { x: 44, label: 'Client' },
  { x: 138, label: 'Express' },
  { x: 232, label: 'Redis' },
  { x: 318, label: 'PostgreSQL' },
]
const X = { client: 44, express: 138, redis: 232, pg: 318 }

interface Step {
  from: number
  to: number
  y: number
  label: string
  tone: Tone
  dashed?: boolean
}

const steps: Step[] = [
  { from: X.client, to: X.express, y: 62, label: 'GET /:shortCode', tone: 'blue' },
  { from: X.express, to: X.redis, y: 82, label: 'GET url:code', tone: 'blue' },
  { from: X.redis, to: X.express, y: 102, label: 'miss', tone: 'violet', dashed: true },
  { from: X.express, to: X.pg, y: 122, label: 'SELECT long_url', tone: 'violet' },
  { from: X.pg, to: X.express, y: 142, label: 'row', tone: 'violet', dashed: true },
  { from: X.express, to: X.redis, y: 162, label: 'SET EX 3600', tone: 'violet' },
  { from: X.express, to: X.client, y: 182, label: '302 redirect', tone: 'blue' },
]

function Arrow({ from, to, y, label, tone, dashed }: Step) {
  const dir = to > from ? 1 : -1
  const color = toneColor[tone]
  return (
    <g>
      <line x1={from} y1={y} x2={to - dir * 4} y2={y} stroke={color} strokeWidth="1.3" strokeDasharray={dashed ? '3 3' : undefined} opacity="0.85" />
      <path d={`M${to} ${y} l${-dir * 6} -3.5 v7 z`} fill={color} />
      <Mono x={(from + to) / 2} y={y - 4} size={8} anchor="middle" fill={palette.text}>
        {label}
      </Mono>
    </g>
  )
}

/** Decorative: request flow through Redis and PostgreSQL. Not a screenshot. */
export default function ShortenerVisual() {
  return (
    <svg viewBox="0 0 360 225" className="h-full w-full" fill="none" aria-hidden>
      {LIFELINES.map((l) => (
        <g key={l.label}>
          <rect x={l.x - 30} y={12} width="60" height="20" rx="6" fill={palette.ink} stroke={palette.line} />
          <Mono x={l.x} y={25} size={8.5} anchor="middle" fill={palette.text}>
            {l.label}
          </Mono>
          <line x1={l.x} y1="32" x2={l.x} y2="196" stroke="rgb(255 255 255 / 0.1)" strokeDasharray="2 4" />
        </g>
      ))}

      {steps.map((s) => (
        <Arrow key={s.y} {...s} />
      ))}

      {/* hit shortcut: Redis answers, PostgreSQL is skipped */}
      <Mono x={240} y={95} size={7.5} fill={palette.blueSoft}>hit: skip to 302</Mono>

      {/* requests play through the steps in order, then a cache hit */}
      {steps.map((s, i) => (
        <Pulse key={s.y} d={`M${s.from} ${s.y} H${s.to}`} tone={s.tone} cycle="ten" delay={i} dur={10} />
      ))}
      <Pulse d={`M${X.redis} 102 H${X.express}`} tone="blue" cycle="ten" delay={7} dur={10} />
      <Pulse d={`M${X.express} 182 H${X.client}`} tone="blue" cycle="ten" delay={8} dur={10} />

      <Mono x={14} y={214} size={7.5}>create: POST /api/shorten → INSERT</Mono>
    </svg>
  )
}
