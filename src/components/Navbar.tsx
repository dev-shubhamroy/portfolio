import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navItems } from '../data/navigation'
import { profile } from '../data/profile'
import { useScrolled } from '../hooks/useScrolled'
import { cn } from '../utils/cn'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors',
        scrolled || open
          ? 'border-white/10 bg-ink-950/80 backdrop-blur-md'
          : 'border-transparent',
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="font-semibold tracking-tight">
          {profile.name}
        </a>

        <ul className="hidden gap-8 text-sm text-slate-300 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-md p-2 text-slate-300 hover:text-white md:hidden"
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
                className="block py-3 text-slate-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
