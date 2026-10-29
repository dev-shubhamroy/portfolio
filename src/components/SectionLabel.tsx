/** Numbered section eyebrow with a line that draws in when its section reveals. */
export default function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <p className="flex items-center gap-3 text-xs tracking-[0.25em] text-electric uppercase">
      <span className="font-mono text-slate-500">{index}</span>
      <span aria-hidden className="label-line h-px w-10 bg-gradient-to-r from-electric to-violet" />
      {children}
    </p>
  )
}
