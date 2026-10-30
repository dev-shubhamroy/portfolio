import { Compass, Hammer, Send, Telescope, type LucideIcon } from 'lucide-react'
import { useActiveSection } from '../hooks/useActiveSection'
import { useChapterProgress } from '../hooks/useChapterProgress'
import { cn } from '../utils/cn'

interface Chapter {
  id: string
  label: string
  hint: string
  icon: LucideIcon
}

// The page read as four chapters of one story.
const chapters: Chapter[] = [
  { id: 'top', label: 'Explore', hint: 'Hero and project universe', icon: Compass },
  { id: 'about', label: 'Discover', hint: 'Engineering to software', icon: Telescope },
  { id: 'projects', label: 'Build', hint: 'Projects and architecture', icon: Hammer },
  { id: 'contact', label: 'Connect', hint: 'Get in touch', icon: Send },
]
const ids = chapters.map((c) => c.id)

/**
 * A slim chapter rail on the right edge of wide screens. The line fills as you
 * scroll, chapters light up as they are reached, and each one is a link to its
 * section. Below 1280px the navbar's own progress line and active link take
 * over, so nothing is ever drawn over content.
 */
export default function StoryRail() {
  const active = useActiveSection(ids)
  const fill = useChapterProgress<HTMLDivElement>(ids)
  const activeIndex = Math.max(ids.indexOf(active), 0)

  return (
    <nav
      aria-label="Story chapters"
      className="story-rail fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="relative flex h-60 flex-col justify-between">
        {/* the line: a faint track and a glowing fill that follows the scroll */}
        <span aria-hidden className="absolute top-3.5 bottom-3.5 left-1/2 w-px -translate-x-1/2 bg-white/10" />
        <span aria-hidden className="absolute top-3.5 bottom-3.5 left-1/2 w-px -translate-x-1/2 overflow-hidden">
          <div
            ref={fill}
            className="story-fill h-full w-full origin-top scale-y-0 bg-gradient-to-b from-electric via-violet to-cyan-glow"
          />
        </span>

        {chapters.map((c, i) => {
          const state = i < activeIndex ? 'visited' : i === activeIndex ? 'active' : 'upcoming'
          const Icon = c.icon
          return (
            <li key={c.id} className="relative">
              <a
                href={`#${c.id}`}
                data-state={state}
                aria-current={state === 'active' ? 'step' : undefined}
                aria-label={`${c.label}: ${c.hint}`}
                className="story-stop group relative grid size-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
              >
                <span aria-hidden className="story-dot absolute inset-0 rounded-full border bg-ink-950/90" />
                <Icon aria-hidden size={13} className="relative" />
                <span
                  aria-hidden
                  className={cn(
                    'story-label pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-full border border-white/10 bg-ink-900/85 px-2.5 py-1 font-mono text-[0.6rem] tracking-widest whitespace-nowrap uppercase backdrop-blur-sm',
                  )}
                >
                  {String(i + 1).padStart(2, '0')} {c.label}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
