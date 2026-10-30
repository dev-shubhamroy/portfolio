import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import SectionLabel from '../components/SectionLabel'
import SkillsConstellation from '../components/about/SkillsConstellation'
import TransitionDiagram from '../components/about/TransitionDiagram'
import { aboutIntro, focusSentence, highlights } from '../data/about'
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

export default function About() {
  const intro = useReveal<HTMLDivElement>()
  const diagram = useReveal<HTMLDivElement>()
  const ledger = useReveal<HTMLUListElement>()

  return (
    <section id="about" aria-labelledby="about-title" className="relative px-5 py-24 lg:py-32">
      {/* section light: violet on the left, reading toward the diagram */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 -left-[20%] size-[44rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(139 92 246 / 0.12), transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div ref={intro} className="reveal-on-scroll">
            <SectionLabel index="01">About me</SectionLabel>
            <h2
              id="about-title"
              className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl"
            >
              From machines to{' '}
              <span className="bg-gradient-to-r from-electric to-violet bg-clip-text text-transparent">
                software.
              </span>
            </h2>
            <div className="mt-7 max-w-xl space-y-4 leading-relaxed text-slate-400">
              <p className="text-lg text-slate-300">{aboutIntro[0]}</p>
              <p>{aboutIntro[1]}</p>
              <p>
                I'm focused on <span className="text-slate-200">{focusSentence}</span>.
              </p>
            </div>

            <ul className="mt-8 flex flex-wrap gap-3">
              {contactLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(!l.href.startsWith('mailto:') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    className={`contact-pill inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-electric/60 hover:text-white ${focusRing}`}
                  >
                    {l.icon}
                    {l.label}
                    {l.label !== 'Email' && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={diagram}
            className="reveal-on-scroll relative mx-auto w-full max-w-md"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {/* corner brackets frame the diagram like a drawing sheet */}
            <span aria-hidden className="absolute -top-2 -left-2 size-5 border-t border-l border-electric/60" />
            <span aria-hidden className="absolute -top-2 -right-2 size-5 border-t border-r border-electric/60" />
            <span aria-hidden className="absolute -bottom-2 -left-2 size-5 border-b border-l border-violet/60" />
            <span aria-hidden className="absolute -right-2 -bottom-2 size-5 border-r border-b border-violet/60" />
            <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-5 backdrop-blur-sm">
              <TransitionDiagram />
              <p className="mt-2 text-center text-[0.6rem] tracking-wider text-slate-500 uppercase">
                Concept illustration
              </p>
            </div>
          </div>
        </div>

        {/* highlights as a ledger of ideas rather than three boxes */}
        <ul
          ref={ledger}
          className="reveal-on-scroll mt-20 grid border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-white/10"
        >
          {highlights.map((h, i) => (
            <li
              key={h.label}
              className="group relative px-0 py-8 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-electric to-violet transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100 md:first:inset-x-0"
              />
              <p className="font-mono text-xs text-slate-600">{String(i + 1).padStart(2, '0')}</p>
              <p className="mt-3 text-xs tracking-wider text-electric uppercase">{h.label}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{h.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{h.body}</p>
              <a
                href="#projects"
                className={`mt-4 inline-flex min-h-8 items-center rounded text-xs text-slate-500 transition-colors hover:text-electric ${focusRing}`}
              >
                See {projectName(h.project)} →
              </a>
            </li>
          ))}
        </ul>

        <SkillsConstellation />
      </div>
    </section>
  )
}
