import { FlowLine, Mono, NodeBox, Pulse } from '../../diagram/primitives'
import { palette, type Tone } from '../../diagram/tokens'

// Three separate lanes, mirroring the README: recommendations, policy RAG and
// approval-gated stock changes. Product search is filtered and ranked by
// backend code; only policy passages use embeddings (pgvector).
const NODE_W = 62
const XS = [14, 104, 194, 284]

interface Lane {
  y: number
  tone: Tone
  title: string
  nodes: { label: string; sub: string }[]
  firstStep: number
}

const lanes: Lane[] = [
  {
    y: 54,
    tone: 'blue',
    title: 'RECOMMENDATIONS',
    firstStep: 0,
    nodes: [
      { label: 'Request', sub: 'shopper' },
      { label: 'LLM', sub: 'criteria' },
      { label: 'Backend', sub: 'filter+rank' },
      { label: 'Products', sub: 'from DB' },
    ],
  },
  {
    y: 119,
    tone: 'violet',
    title: 'POLICY Q&A (RAG)',
    firstStep: 3,
    nodes: [
      { label: 'Question', sub: 'shopper' },
      { label: 'Embed', sub: 'Ollama' },
      { label: 'pgvector', sub: 'search' },
      { label: 'Answer', sub: '+ citations' },
    ],
  },
  {
    y: 184,
    tone: 'cyan',
    title: 'STOCK CHANGES',
    firstStep: 6,
    nodes: [
      { label: 'Staff', sub: 'proposes' },
      { label: 'Manager', sub: 'approves' },
      { label: 'Txn', sub: '+ audit log' },
    ],
  },
]

/** Decorative: schematic of RetailPulseAI's implemented flows. Not a screenshot. */
export default function RetailVisual() {
  return (
    <svg viewBox="0 0 360 225" className="h-full w-full" fill="none" aria-hidden>
      {lanes.map((lane) => (
        <g key={lane.title}>
          <Mono x={14} y={lane.y - 22} size={7.5} fill={palette.muted}>
            {lane.title}
          </Mono>
          {lane.nodes.map((n, i) => (
            <NodeBox
              key={n.label}
              x={XS[i]}
              y={lane.y - 15}
              w={NODE_W}
              h={30}
              label={n.label}
              sub={n.sub}
              tone={i === 0 ? 'neutral' : lane.tone}
              fontSize={9}
            />
          ))}
          {lane.nodes.slice(1).map((_, i) => {
            const d = `M${XS[i] + NODE_W} ${lane.y} H${XS[i + 1]}`
            return (
              <g key={i}>
                <FlowLine d={d} tone={lane.tone} />
                <Pulse d={d} tone={lane.tone} cycle="ten" delay={lane.firstStep + i} dur={10} />
              </g>
            )
          })}
        </g>
      ))}
      <Mono x={274} y={178} size={7.5}>LLM never</Mono>
      <Mono x={274} y={189} size={7.5}>writes to the DB</Mono>
      {/* lane dividers */}
      <line x1="14" y1="86" x2="346" y2="86" stroke={palette.faint} />
      <line x1="14" y1="151" x2="346" y2="151" stroke={palette.faint} />
    </svg>
  )
}
