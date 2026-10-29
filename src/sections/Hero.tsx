import { ArrowRight, Download, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import FloatingLabels from '../components/FloatingLabels'
import Globe from '../components/globe/Globe'
import HeroBackdrop from '../components/HeroBackdrop'
import IconLink from '../components/IconLink'
import { profile } from '../data/profile'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric'

export default function Hero() {
  const { links, resumeUrl } = profile
  const email = links.email ? `mailto:${links.email}` : ''

  return (
    <section id="top" className="relative overflow-hidden px-5 pt-28 pb-24 lg:pt-24">
      <HeroBackdrop />

      <div className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <p
            className="reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs tracking-wide text-slate-300"
            style={{ '--i': 0 } as React.CSSProperties}
          >
            <span className="size-1.5 rounded-full bg-cyan-glow shadow-[0_0_8px_var(--color-cyan-glow)]" />
            Open to software engineering opportunities
          </p>

          <h1
            className="reveal mt-7 text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-6xl xl:text-7xl"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            Building Software for a{' '}
            <span className="bg-gradient-to-r from-electric via-violet to-cyan-glow bg-clip-text text-transparent">
              Better Tomorrow.
            </span>
          </h1>

          <p
            className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
            style={{ '--i': 2 } as React.CSSProperties}
          >
            I'm <span className="text-white">{profile.name}</span>, a final-year Mechanical
            Engineering student at Delhi Technological University, looking for software
            engineering internships and entry-level roles. I'm drawn to backend engineering,
            full-stack development and AI-powered applications.
          </p>

          <div
            className="reveal mt-9 flex flex-wrap gap-3"
            style={{ '--i': 3 } as React.CSSProperties}
          >
            <a
              href="#projects"
              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violet px-6 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110 ${focusRing}`}
            >
              View Projects <ArrowRight size={16} />
            </a>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                download
                className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-white/40 ${focusRing}`}
              >
                Download Resume <Download size={16} />
              </a>
            ) : (
              <span
                aria-disabled="true"
                title="Resume file not added yet (set resumeUrl in src/data/profile.ts)"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-white/15 px-6 py-3 text-sm font-semibold text-slate-500"
              >
                Download Resume <span className="text-xs font-normal">(coming soon)</span>
              </span>
            )}
          </div>

          <div
            className="reveal mt-8 flex items-center gap-3"
            style={{ '--i': 4 } as React.CSSProperties}
          >
            <IconLink icon={GithubIcon} label="GitHub" href={links.github} />
            <IconLink icon={LinkedinIcon} label="LinkedIn" href={links.linkedin} />
            <IconLink icon={Mail} label="Email" href={email} />
          </div>
        </div>

        {/* Interactive 3D Earth (falls back to a CSS placeholder without WebGL) */}
        <div className="relative mx-auto w-full max-w-[34rem]">
          <Globe />
          <FloatingLabels />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className={`reveal absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] tracking-[0.25em] text-slate-500 uppercase hover:text-slate-300 sm:flex ${focusRing}`}
        style={{ '--i': 6 } as React.CSSProperties}
      >
        Scroll
        <span className="scroll-nudge block h-8 w-px bg-gradient-to-b from-electric to-transparent" />
      </a>
    </section>
  )
}
