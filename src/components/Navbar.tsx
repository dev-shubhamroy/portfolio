import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navItems } from '../data/navigation'
import { profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useScrolled } from '../hooks/useScrolled'
import { cn } from '../utils/cn'

const sectionIds = navItems.map((item) => item.href.slice(1))

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  const active = useActiveSection(sectionIds)
  const progress = useScrollProgress<HTMLDivElement>()

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled || open ? 'border-white/10 bg-ink-950/75 backdrop-blur-md' : 'border-transparent',
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a
          href="#top"
          className="group inline-flex items-center gap-2.5 rounded font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-electric to-violet text-[0.65rem] font-bold text-ink-950 transition-transform duration-300 group-hover:rotate-6"
          >
            SR
          </span>
          {profile.name}
        </a>

        <ul className="hidden gap-8 text-sm md:flex">
          {navItems.map((item) => {
            const current = active === item.href.slice(1)
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={current ? 'true' : undefined}
                  className={cn(
                    'nav-link relative rounded py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric',
                    current ? 'text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className="rounded-md p-2 text-slate-300 hover:text-white focus-visible:outline-2 focus-visible:outline-electric md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <ul className="border-t border-white/10 px-5 py-3 md:hidden">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href.slice(1) ? 'true' : undefined}
                className={cn(
                  'block py-3 transition-colors hover:text-white',
                  active === item.href.slice(1) ? 'text-white' : 'text-slate-400',
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* reading progress */}
      <div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-px overflow-hidden">
        <div
          ref={progress}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-electric via-violet to-cyan-glow"
        />
      </div>
    </header>
  )
}
