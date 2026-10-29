import { ArrowUp, Mail, Phone } from 'lucide-react'
import { navItems } from '../data/navigation'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const currentYear = new Date().getFullYear()

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric'

const socials = [
  { label: 'GitHub', href: profile.links.github, icon: <GithubIcon size={18} />, external: true },
  { label: 'LinkedIn', href: profile.links.linkedin, icon: <LinkedinIcon size={18} />, external: true },
  { label: `Call ${profile.phone.display}`, href: profile.phone.href, icon: <Phone size={18} />, external: false },
  { label: 'Email', href: `mailto:${profile.links.email}`, icon: <Mail size={18} />, external: false },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="footer-light absolute top-0 h-px w-56 bg-gradient-to-r from-transparent via-cyan-glow to-transparent" />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-electric to-violet text-[0.55rem] font-bold text-ink-950"
            >
              SR
            </span>
            {profile.name}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            © {currentYear} · Built with React, TypeScript and Three.js
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`inline-flex min-h-11 items-center rounded px-1 transition-colors hover:text-white ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.external ? `${s.label} (opens in a new tab)` : s.label}
                  {...(s.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className={`inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-electric/60 hover:text-white contact-pill ${focusRing}`}
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#top"
            aria-label="Back to top"
            className={`inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-violet/60 hover:text-white ${focusRing}`}
          >
            <ArrowUp size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
