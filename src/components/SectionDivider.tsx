/** Hairline with a soft light, placed at section boundaries. */
export default function SectionDivider() {
  return (
    <div aria-hidden className="relative mx-auto h-px max-w-6xl px-5">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute top-1/2 left-1/2 h-px w-40 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-electric/70 to-transparent" />
      <div className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow shadow-[0_0_12px_2px_rgb(34_211_238/0.6)]" />
    </div>
  )
}
