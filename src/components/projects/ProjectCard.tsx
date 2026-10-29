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

interface Props {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: Props) {
  const reveal = useReveal<HTMLLIElement>()
  const card = useCardEffects<HTMLElement>()
  const Visual = visuals[project.visual]
  const titleId = `${project.id}-title`

  return (
    <li
      ref={reveal}
      className={cn('reveal-on-scroll', project.featured && 'lg:col-span-2')}
      style={{ '--i': index } as React.CSSProperties}
    >
      <article
        ref={card}
        aria-labelledby={titleId}
        className={cn(
          'project-card group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8',
          project.featured
            ? 'grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center'
            : 'flex flex-col',
        )}
      >
        <div className={cn('relative z-10 flex flex-1 flex-col', project.featured && 'md:order-1')}>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.06] px-3 py-1 text-[0.7rem] tracking-wide text-electric">
            {project.featured && <span className="text-violet">Featured</span>}
            {project.featured && <span aria-hidden className="text-white/20">·</span>}
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
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-gradient-to-r from-electric to-violet" />
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
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-electric/60 hover:bg-electric/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
            >
              <GithubIcon size={16} />
              View on GitHub
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <figure
          className={cn(
            'relative z-10 order-first mb-6 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-ink-950/60',
            project.featured ? 'md:order-2 md:mb-0' : 'sm:mb-8',
          )}
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(56_189_248/0.12),transparent_60%),radial-gradient(ellipse_at_80%_90%,rgb(139_92_246/0.14),transparent_55%)]" />
          <Visual />
          <figcaption className="absolute right-3 bottom-2 text-[0.6rem] tracking-wider text-slate-500 uppercase">
            Concept illustration
          </figcaption>
        </figure>
      </article>
    </li>
  )
}
