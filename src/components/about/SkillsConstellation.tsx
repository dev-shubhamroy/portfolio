import { ArrowUpRight } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { groups, hubs, skills, usedIn, type SkillNode } from '../../data/skills'
import { projects } from '../../data/projects'
import { useReveal } from '../../hooks/useReveal'
import { cn } from '../../utils/cn'

const tones = {
  blue: { rgb: '56 189 248', soft: '#7dd3fc' },
  violet: { rgb: '139 92 246', soft: '#c4b5fd' },
  cyan: { rgb: '34 211 238', soft: '#67e8f9' },
} as const

const groupTone = Object.fromEntries(groups.map((g) => [g.id, g.tone]))
const hubById = Object.fromEntries(hubs.map((h) => [h.id, h]))
const nameOf = (id: string) => hubById[id]?.label ?? id

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric'

/**
 * Technologies as a small constellation: each node links to the featured
 * project (or this portfolio) that uses it. Plain SVG lines under HTML buttons,
 * so it is keyboard- and touch-friendly. The grouped chip list below is both a
 * readable fallback and a second way to pick a node.
 */
export default function SkillsConstellation() {
  const frame = useReveal<HTMLDivElement>()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const selected = skills.find((s) => s.id === selectedId) ?? null
  const lit = skills.find((s) => s.id === (hoverId ?? selectedId)) ?? null
  const litUses = lit ? usedIn(lit) : []

  const edges = skills.flatMap((n) => usedIn(n).map((hubId) => ({ node: n, hub: hubById[hubId] })))

  const select = (id: string) => setSelectedId((cur) => (cur === id ? null : id))
  const hover = (id: string | null) => ({
    onPointerEnter: () => setHoverId(id),
    onPointerLeave: () => setHoverId(null),
    onFocus: () => setHoverId(id),
    onBlur: () => setHoverId(null),
  })

  return (
    <div ref={frame} className="reveal-on-scroll mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-semibold tracking-tight">Technical constellation</h3>
        <p className="text-sm text-slate-500">
          Technologies used in the featured projects and in this portfolio. Select one to see where.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* the constellation */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900/40 backdrop-blur-sm sm:aspect-[100/72]">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(99_102_241/0.14),transparent_65%)]" />

          <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" fill="none">
            {edges.map(({ node, hub }) => {
              const on = lit?.id === node.id
              const tone = tones[groupTone[node.group]]
              return (
                <line
                  key={`${node.id}-${hub.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={hub.x}
                  y2={hub.y}
                  stroke={on ? tone.soft : 'rgb(255 255 255)'}
                  strokeOpacity={on ? 0.9 : lit ? 0.06 : 0.14}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  className={cn('constellation-edge', on && 'flow')}
                />
              )
            })}
          </svg>

          {/* project stars: links to the matching card */}
          {hubs.map((h) => (
            <a
              key={h.id}
              href={h.href}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              data-dim={lit ? !litUses.includes(h.id) : undefined}
              className={cn(
                'constellation-hub absolute z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
                focusRing,
              )}
              aria-label={`${h.label}${h.id === 'portfolio' ? '' : ' project'}`}
            >
              <span aria-hidden className="constellation-hub-ring" />
              <span aria-hidden className="size-2 rounded-full bg-white/90 shadow-[0_0_10px_2px_rgb(255_255_255/0.5)]" />
              <span className={cn('constellation-label top-full mt-1 text-slate-200', h.alignEnd && 'constellation-label--end')}>{h.label}</span>
            </a>
          ))}

          {/* technology nodes */}
          {skills.map((n) => {
            const weight = usedIn(n).length
            const tone = tones[groupTone[n.group]]
            const size = 22 + weight * 6
            const isSelected = selectedId === n.id
            return (
              <button
                key={n.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${n.label}. Used in ${usedIn(n).map(nameOf).join(', ')}.`}
                onClick={() => select(n.id)}
                {...hover(n.id)}
                data-selected={isSelected}
                data-dim={lit ? lit.id !== n.id : undefined}
                style={{ left: `${n.x}%`, top: `${n.y}%`, '--tone': tone.rgb, '--size': `${size}px` } as CSSProperties}
                className={cn(
                  'constellation-node absolute z-20 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
                  focusRing,
                )}
              >
                <span aria-hidden className="constellation-core" />
                <span className="constellation-label top-full mt-0.5 hidden text-[0.62rem] text-slate-300 sm:block">{n.label}</span>
              </button>
            )
          })}
        </div>

        {/* details */}
        <div className="rounded-3xl border border-white/10 bg-ink-900/40 p-6 backdrop-blur-sm" aria-live="polite">
          {selected ? <Detail node={selected} /> : (
            <div>
              <p className="font-mono text-xs tracking-wider text-slate-500 uppercase">Constellation</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Each point is a technology; each line leads to a project that uses it. The stars
                are the three featured projects and this portfolio. Pick a technology here or
                below to see what it is and where I used it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* readable fallback and alternative way to choose */}
      <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.id}>
            <h4 className="font-mono text-xs tracking-wider text-slate-400 uppercase">{g.label}</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {skills.filter((s) => s.group === g.id).map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={selectedId === s.id}
                    onClick={() => select(s.id)}
                    {...hover(s.id)}
                    style={{ '--tone': tones[g.tone].rgb } as CSSProperties}
                    className={cn(
                      'skill-chip min-h-9 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300',
                      focusRing,
                    )}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function Detail({ node }: { node: SkillNode }) {
  const group = groups.find((g) => g.id === node.group)!
  const uses = usedIn(node)
  return (
    <div style={{ '--tone': tones[group.tone].rgb } as CSSProperties}>
      <p className="font-mono text-xs tracking-wider text-[rgb(var(--tone))] uppercase">{group.label}</p>
      <h4 className="mt-2 text-2xl font-semibold tracking-tight">{node.label}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{node.description}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{node.usage}</p>

      <p className="mt-5 font-mono text-xs tracking-wider text-slate-500 uppercase">Used in</p>
      <ul className="mt-2 flex flex-col gap-2">
        {uses.map((id) => {
          const hub = hubById[id]
          const project = projects.find((p) => p.id === id)
          return (
            <li key={id}>
              <a
                href={hub.href}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-[rgb(var(--tone)/0.7)] hover:text-white',
                  focusRing,
                )}
              >
                {hub.label}
                {project && <span className="text-xs text-slate-500">· {project.status}</span>}
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
