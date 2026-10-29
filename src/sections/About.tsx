import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import TransitionDiagram from '../components/about/TransitionDiagram'
import { aboutIntro, focusSentence, highlights, portfolioStack, projectSkills } from '../data/about'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { useReveal } from '../hooks/useReveal'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric'

const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? ''

const contactLinks = [
  { label: 'GitHub', href: profile.links.github, icon: <GithubIcon size={16} /> },
  { label: 'LinkedIn', href: profile.links.linkedin, icon: <LinkedinIcon size={16} /> },
  { label: 'Email', href: `mailto:${profile.links.email}`, icon: <Mail size={16} /> },
]

function Pill({ children, dashed }: { children: string; dashed?: boolean }) {
  return (
    <li
      className={`rounded-full px-3 py-1 text-xs ${
        dashed
          ? 'border border-dashed border-violet/40 text-violet-200/90'
          : 'border border-white/10 bg-white/[0.04] text-slate-300'
      }`}
    >
      {children}
    </li>
  )
}

export default function About() {
  const intro = useReveal<HTMLDivElement>()
  const diagram = useReveal<HTMLDivElement>()
  const skills = useReveal<HTMLDivElement>()

  return (
    <section id="about" aria-labelledby="about-title" className="relative px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div ref={intro} className="reveal-on-scroll">
            <p className="text-xs tracking-[0.25em] text-electric uppercase">About me</p>
            <h2 id="about-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              From machines to{' '}
              <span className="bg-gradient-to-r from-electric to-violet bg-clip-text text-transparent">
                software.
              </span>
            </h2>
            <div className="mt-6 max-w-xl space-y-4 leading-relaxed text-slate-400">
              {aboutIntro.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                I'm focused on{' '}
                <span className="text-slate-200">{focusSentence}</span>.
              </p>
            </div>

            <ul className="mt-7 flex flex-wrap gap-3">
              {contactLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(!l.href.startsWith('mailto:') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-electric/60 hover:text-white ${focusRing}`}
                  >
                    {l.icon}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={diagram}
            className="reveal-on-scroll mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-5"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            <div className="aspect-[360/260]">
              <TransitionDiagram />
            </div>
            <p className="mt-2 text-center text-[0.6rem] tracking-wider text-slate-500 uppercase">
              Concept illustration
            </p>
          </div>
        </div>

        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <HighlightCard key={h.label} index={i} {...h} />
          ))}
        </ul>

        <div
          ref={skills}
          className="reveal-on-scroll mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
        >
          <h3 className="text-xl font-semibold tracking-tight">Technical toolkit</h3>
          <p className="mt-2 text-sm text-slate-500">
            Technologies used in the featured projects below, grouped by role, plus the stack of this portfolio.
          </p>

          <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {projectSkills.map((g) => (
              <div key={g.name}>
                <dt className="text-xs tracking-wider text-slate-400 uppercase">{g.name}</dt>
                <dd>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-xs tracking-wider text-slate-400 uppercase">
                Built this portfolio with
              </dt>
              <dd>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {portfolioStack.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="text-xs tracking-wider text-slate-400 uppercase">Areas I'm growing into</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {profile.interests.map((item) => (
                <Pill key={item} dashed>
                  {item}
                </Pill>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function HighlightCard({ label, title, body, project, index }: (typeof highlights)[number] & { index: number }) {
  const ref = useReveal<HTMLLIElement>()
  return (
    <li
      ref={ref}
      className="reveal-on-scroll group rounded-3xl last:md:col-span-2 last:lg:col-span-1 border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-electric/30 focus-within:border-electric/30"
      style={{ '--i': index } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="block h-px w-10 bg-gradient-to-r from-electric to-violet transition-[width] duration-500 group-hover:w-20"
      />
      <p className="mt-4 text-xs tracking-wider text-electric uppercase">{label}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
      <a
        href="#projects"
        className={`mt-4 inline-block rounded text-xs text-slate-500 transition-colors hover:text-electric ${focusRing}`}
      >
        See {projectName(project)} →
      </a>
    </li>
  )
}
