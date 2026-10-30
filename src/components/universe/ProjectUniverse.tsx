import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { projects, type VisualKind } from '../../data/projects'
import FloatingLabels from '../FloatingLabels'
import Globe from '../globe/Globe'
import { accents } from '../projects/theme'

// Same accent per project as the Projects section cards.
const accent = Object.fromEntries(
  Object.entries(accents).map(([kind, a]) => [kind, a.accent]),
) as Record<VisualKind, string>

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric'

/**
 * The hero's visual: the Earth, three project satellites orbiting it, and the
 * ways to explore them. The 3D satellites are decoration; the links over them
 * (and the pills below) are plain anchors to the matching project card, so
 * everything works by mouse, keyboard and touch, and without WebGL.
 */
export default function ProjectUniverse() {
  const markers = useRef<(HTMLElement | null)[]>([])
  const highlight = useRef<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = projects.find((p) => p.id === activeId)

  const activate = (id: string | null) => {
    highlight.current = id
    setActiveId(id)
  }

  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <div className="relative">
        <Globe markers={markers} highlight={highlight} />
        <FloatingLabels />

        {projects.map((p, i) => (
          <a
            key={p.id}
            ref={(el) => {
              markers.current[i] = el
            }}
            href={`#${p.id}`}
            data-marker
            aria-label={`${p.name}: ${p.blurb} Go to project.`}
            onPointerEnter={() => activate(p.id)}
            onPointerLeave={() => activate(null)}
            onFocus={() => activate(p.id)}
            onBlur={() => activate(null)}
            style={{ '--accent': accent[p.visual] } as React.CSSProperties}
            className={`universe-marker absolute top-0 left-0 z-20 grid size-[4.5rem] place-items-center rounded-full select-none ${focusRing}`}
          >
            <span aria-hidden className="universe-ring" />
            <span aria-hidden className="universe-tag">
              {p.name}
            </span>
          </a>
        ))}
      </div>

      {/* Always-visible way in, plus a readable preview of the active project. */}
      <div role="group" aria-label="Explore my projects" className="mt-4">
        <ul className="flex flex-wrap justify-center gap-2">
          {projects.map((p) => (
            <li key={p.id}>
              <a
                href={`#${p.id}`}
                onPointerEnter={() => activate(p.id)}
                onPointerLeave={() => activate(null)}
                onFocus={() => activate(p.id)}
                onBlur={() => activate(null)}
                style={{ '--accent': accent[p.visual] } as React.CSSProperties}
                className={`universe-pill inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300 hover:text-white ${focusRing}`}
                data-active={activeId === p.id}
              >
                <span aria-hidden className="size-1.5 rounded-full bg-[rgb(var(--accent))]" />
                {p.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-3 min-h-[4.5rem] text-center" aria-live="polite">
          {active ? (
            <div className="universe-preview mx-auto max-w-sm" style={{ '--accent': accent[active.visual] } as React.CSSProperties}>
              <p className="flex items-baseline justify-between gap-3 text-sm font-semibold">
                {active.name}
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-normal text-[rgb(var(--accent))]">
                  View project <ArrowRight size={12} />
                </span>
              </p>
              <p className="mt-1 text-left text-xs leading-relaxed text-slate-400">{active.blurb}</p>
            </div>
          ) : (
            <p className="mx-auto max-w-xs pt-3 text-xs text-slate-500">
              Three project satellites orbit the Earth. Hover, focus or tap one to open its project.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
