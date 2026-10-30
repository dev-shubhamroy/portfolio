import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import SectionLabel from '../components/SectionLabel'
import ProjectCard from '../components/projects/ProjectCard'
import { accents } from '../components/projects/theme'
import { projects } from '../data/projects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReveal } from '../hooks/useReveal'

// The code window and its source excerpts are only downloaded when first needed.
const loadCodePreview = () => import('../components/projects/CodePreview')
const CodePreview = lazy(loadCodePreview)

export default function Projects() {
  const heading = useReveal<HTMLDivElement>()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const panel = useRef<HTMLDivElement>(null)
  // openId drives aria and visibility; shownId keeps the content while closing.
  const [openId, setOpenId] = useState<string | null>(null)
  const [shownId, setShownId] = useState<string | null>(null)
  const shown = projects.find((p) => p.id === shownId)

  const toggle = (id: string) => {
    if (openId === id) {
      setOpenId(null)
      return
    }
    setShownId(id)
    setOpenId(id)
  }

  // Bring a newly opened window into view (only if it isn't already).
  useEffect(() => {
    if (!openId) return
    const t = window.setTimeout(
      () => {
        const el = panel.current
        if (!el) return
        el.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: el.offsetHeight < window.innerHeight - 120 ? 'center' : 'start',
        })
      },
      450,
    )
    return () => window.clearTimeout(t)
  }, [openId, reducedMotion])

  const close = () => {
    const id = openId
    setOpenId(null)
    if (id) document.getElementById(`${id}-code-toggle`)?.focus()
  }

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={heading} className="reveal-on-scroll max-w-2xl">
          <SectionLabel index="02">Selected work</SectionLabel>
          <h2 id="projects-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Featured{' '}
            <span className="bg-gradient-to-r from-electric to-violet bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mt-5 text-slate-400">
            Three projects from my GitHub. Descriptions and tech stacks are taken from each
            repository's code and README.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              codeOpen={openId === project.id}
              onToggleCode={() => toggle(project.id)}
              onPrefetchCode={() => void loadCodePreview()}
            />
          ))}
        </ul>

        {/* One full-width code window, opened from any card's "Explore code". */}
        <div
          ref={panel}
          id="project-code"
          role="region"
          aria-label={shown ? `${shown.name} code preview` : 'Project code preview'}
          data-open={openId !== null}
          inert={openId === null}
          onKeyDown={(e) => {
            if (e.key === 'Escape') close()
          }}
          style={
            shown
              ? ({ '--accent': accents[shown.visual].accent, '--accent-2': accents[shown.visual].accent2 } as React.CSSProperties)
              : undefined
          }
          className="code-reveal"
        >
          <div className="code-reveal-inner">
            <div className="pt-8">
              {shown && (
                <Suspense fallback={<div className="h-48 motion-safe:animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />}>
                  <CodePreview key={shown.id} project={shown} onClose={close} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
