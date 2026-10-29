import type { CSSProperties, ReactNode } from 'react'
import { mono, palette, toneColor, toneSoft, type Tone } from './tokens'

/** A connection: faint base line with a slowly flowing dashed overlay. */
export function FlowLine({
  d,
  tone = 'blue',
  opacity = 1,
  width = 1.4,
  animated = true,
}: {
  d: string
  tone?: Tone
  opacity?: number
  width?: number
  animated?: boolean
}) {
  return (
    <>
      <path d={d} stroke={toneColor[tone]} strokeWidth={width} opacity={opacity * 0.4} />
      {animated && (
        <path className="flow" d={d} stroke={toneColor[tone]} strokeWidth={width} opacity={opacity} />
      )}
    </>
  )
}

/**
 * A small light that travels along a path. `cycle` makes it move during one
 * slot of a shared cycle (so steps in a diagram play in order); the default
 * loops on its own.
 */
export function Pulse({
  d,
  tone = 'blue',
  dur = 4,
  delay = 0,
  cycle,
  r = 2.4,
}: {
  d: string
  tone?: Tone
  dur?: number
  delay?: number
  cycle?: 'ten' | 'nine'
  r?: number
}) {
  const className = cycle === 'ten' ? 'travel-ten' : cycle === 'nine' ? 'travel-seq' : 'travel'
  return (
    <circle
      r={r}
      fill={toneSoft[tone]}
      className={className}
      style={{ offsetPath: `path('${d}')`, '--dur': `${dur}s`, '--delay': `${delay}s` } as CSSProperties}
    />
  )
}

/** Rounded node with a centered label, optionally lit in turn through `seqDelay`. */
export function NodeBox({
  x,
  y,
  w,
  h,
  label,
  sub,
  tone = 'neutral',
  seqDelay,
  fontSize = 9,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  tone?: Tone
  /** seconds into the shared 9s cycle at which this node lights up */
  seqDelay?: number
  fontSize?: number
}) {
  const stroke = tone === 'neutral' ? palette.line : toneColor[tone]
  const fill = tone === 'neutral' ? palette.ink : `${toneColor[tone]}14`
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill={fill} stroke={stroke} strokeWidth="1.2" />
      {seqDelay !== undefined && (
        <rect
          className="seq"
          style={{ '--delay': `${seqDelay}s` } as CSSProperties}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="7"
          fill={`${toneColor[tone === 'neutral' ? 'blue' : tone]}30`}
          stroke={toneSoft[tone === 'neutral' ? 'blue' : tone]}
          strokeWidth="1.4"
        />
      )}
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -1 : 3)}
        textAnchor="middle"
        fontSize={fontSize}
        fill={tone === 'neutral' ? palette.text : toneSoft[tone]}
        style={mono}
      >
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle" fontSize={fontSize - 1.5} fill={palette.muted} style={mono}>
          {sub}
        </text>
      )}
    </g>
  )
}

export function Mono({
  x,
  y,
  children,
  fill = palette.muted,
  size = 8.5,
  anchor,
}: {
  x: number
  y: number
  children: ReactNode
  fill?: string
  size?: number
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} style={mono}>
      {children}
    </text>
  )
}
