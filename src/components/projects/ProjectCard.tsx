import { ArrowUpRight } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Project, VisualKind } from '../../data/projects'
import { useCardEffects } from '../../hooks/useCardEffects'
import { useReveal } from '../../hooks/useReveal'
import { cn } from '../../utils/cn'
import { GithubIcon } from '../BrandIcons'
import BranchVisual from './visuals/BranchVisual'
import RetailVisual from './visuals/RetailVisual'
import ShortenerVisual from './visuals/ShortenerVisual'

const visuals: Record<VisualKind, ComponentType> = {
  retail: RetailVisual,
  branch: BranchVisual,
  shortener: ShortenerVisual,
}

// Presentation only: each project gets its own accent pair, and a small mono
// description of its architecture illustration for screen readers.
const themes: Record<VisualKind, { accent: string; accent2: string; alt: string }> = {
  retail: {
    accent: '56 189 248',
    accent2: '139 92 246',
    alt: 'Schematic of three separate flows: recommendations (request, LLM criteria, backend filtering and ranking, products), policy Q&A (question, embedding, pgvector search, cited answer), and stock changes (staff proposal, manager approval, transaction with audit log).',
  },
  branch: { accent: '34 211 238',
    accent2: '56 189 248',     alt: 'Schematic of a repository with one worktree per branch, and a supervisor that holds a lock and moves a job through starting, running, then succeeded, failed or stopped.',
  },
  shortener: { accent: '167 139 250',
    accent2: '56 189 248',     alt: 'Sequence diagram: client requests a short code, Express checks Redis, on a miss queries PostgreSQL and caches the result for one hour, then redirects; a cache hit skips PostgreSQL.',
  },
}

interface Props {
  project: Project
  index: number
  total: number
}

export default function ProjectCard({ project, index, total }: Props) {
  const reveal = useReveal<HTMLLIElement>()
  const card = useCardEffects<HTMLElement>()
  const Visual = visuals[project.visual]
  const theme = themes[project.visual]
  const titleId = `${project.id}-title`

  return (
    <li
      ref={reveal}
      id={project.id}
      className={cn('reveal-on-scroll scroll-mt-7', project.featured && 'lg:col-span-2')}
      style={{ '--i': index } as React.CSSProperties}
    >
      <article
        ref={card}
        aria-labelledby={titleId}
        style={{ '--accent': theme.accent, '--accent-2': theme.accent2 } as React.CSSProperties}
        className={cn(
          'project-card group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900/40 p-6 backdrop-blur-sm sm:p-8',
          project.featured
            ? 'grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center'
            : 'flex flex-col',
        )}
      >
        <span
          aria-hidden
          className="accent-rule absolute inset-x-8 top-0 h-px opacity-70"
        />
        <span
          aria-hidden
          className="absolute top-5 right-6 z-10 font-mono text-xs tracking-widest text-slate-600"
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>

        <div className={cn('relative z-10 flex flex-1 flex-col', project.featured && 'md:order-1')}>
          <p className="accent-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] tracking-wide">
            {project.featured && <span className="text-white/80">Featured</span>}
            {project.featured && (
              <span aria-hidden className="text-white/20">
                ·
              </span>
            )}
            {project.status}
          </p>
          <h3 id={titleId} className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {project.description}
          </p>

          <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-slate-400">
            {project.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span aria-hidden className="accent-rule mt-2 size-1 shrink-0 rounded-full" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <ul aria-label={`${project.name} technologies`} className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t, i) => (
              <li
                key={t}
                className="tech-badge rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
                style={{ '--b': i } as React.CSSProperties}
              >
                {t}
              </li>
            ))}
          </ul>

          {project.note && <p className="mt-5 text-xs leading-relaxed text-slate-500">{project.note}</p>}

          <div className="mt-auto pt-6">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} on GitHub (opens in a new tab)`}
              className="btn-sheen inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[rgb(var(--accent)/0.7)] hover:bg-[rgb(var(--accent)/0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
            >
              <GithubIcon size={16} />
              View on GitHub
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <figure
          className={cn(
            'figure-sheen relative z-10 order-first mb-6 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-ink-950/70',
            project.featured ? 'md:order-2 md:mb-0' : 'sm:mb-8',
          )}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(var(--accent)/0.16),transparent_60%),radial-gradient(ellipse_at_80%_90%,rgb(var(--accent-2)/0.16),transparent_55%)]"
          />
          <Visual />
          <span className="sr-only">{theme.alt}</span>
          <figcaption className="absolute right-3 bottom-2 text-[0.6rem] tracking-wider text-slate-500 uppercase">
            Concept illustration
          </figcaption>
        </figure>
      </article>
    </li>
  )
}
