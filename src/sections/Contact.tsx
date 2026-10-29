import { Mail, MessageCircle, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import CopyEmailButton from '../components/contact/CopyEmailButton'
import { profile } from '../data/profile'
import { useReveal } from '../hooks/useReveal'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric'

export default function Contact() {
  const panel = useReveal<HTMLDivElement>()
  const { email, github, linkedin } = profile.links
  const mailto = `mailto:${email}?subject=${encodeURIComponent('Hello Shubham')}`

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative px-5 py-24 lg:py-32">
      <div
        ref={panel}
        className="reveal-on-scroll relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-14 text-center backdrop-blur-sm sm:px-12 sm:py-20"
      >
        {/* decorative glow and rings */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-violet/20 blur-[120px]" />
          <div className="absolute -bottom-40 left-[10%] size-[22rem] rounded-full bg-electric/15 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
          <div className="absolute top-1/2 left-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-electric/10" />
        </div>

        <div className="relative">
          <p className="text-xs tracking-[0.25em] text-electric uppercase">Contact</p>
          <h2 id="contact-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Let's{' '}
            <span className="bg-gradient-to-r from-electric via-violet to-cyan-glow bg-clip-text text-transparent">
              get in touch.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-slate-400">
            I'm looking for software engineering internships and entry-level roles. If you're
            hiring, building something interesting, or want to talk about my projects, I'd be glad
            to hear from you.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3">
            <a
              href={mailto}
              className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violet px-7 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110 ${focusRing}`}
            >
              <Mail size={17} />
              Email me
            </a>
            <p className="text-sm text-slate-300 select-all">{email}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <CopyEmailButton email={email} />
            </div>
          </div>

          <ul className="mt-9 flex flex-wrap justify-center gap-3">
            <li>
              <a
                href={profile.phone.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition-colors hover:border-electric/60 hover:text-white ${focusRing}`}
              >
                <Phone size={16} />
                <span className="sr-only">Call </span>
                {profile.phone.display}
              </a>
            </li>
            <li>
              <a
                href={profile.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition-colors hover:border-electric/60 hover:text-white ${focusRing}`}
              >
                <MessageCircle size={16} />
                WhatsApp
                <span className="sr-only"> {profile.whatsapp.display} (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition-colors hover:border-electric/60 hover:text-white ${focusRing}`}
              >
                <GithubIcon size={16} />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition-colors hover:border-electric/60 hover:text-white ${focusRing}`}
              >
                <LinkedinIcon size={16} />
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
