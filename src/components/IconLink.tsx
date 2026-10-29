import type { ComponentType } from 'react'

interface Props {
  icon: ComponentType<{ size?: number }>
  label: string
  href: string
}

const base =
  'inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-slate-400'

/** Icon link; renders a marked, non-interactive placeholder when `href` is empty. */
export default function IconLink({ icon: Icon, label, href }: Props) {
  if (!href) {
    return (
      <span
        className={`${base} cursor-not-allowed opacity-40`}
        title={`${label} link not set yet (src/data/profile.ts)`}
        role="img"
        aria-label={`${label} (not set)`}
      >
        <Icon size={18} />
      </span>
    )
  }
  const external = !href.startsWith('mailto:')
  return (
    <a
      href={href}
      aria-label={label}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={`${base} transition-colors hover:border-electric/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric`}
    >
      <Icon size={18} />
    </a>
  )
}
