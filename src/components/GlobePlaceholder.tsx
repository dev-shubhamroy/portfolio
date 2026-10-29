/**
 * CSS-only stand-in for the future 3D Earth. Keep the outer box (size and
 * position) when swapping in the real <Globe /> component.
 */
export default function GlobePlaceholder() {
  return (
    <div
      aria-hidden
      className="fade-in relative mx-auto aspect-square w-full max-w-[34rem]"
    >
      {/* atmosphere glow */}
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(56_189_248/0.28),rgb(139_92_246/0.18)_45%,transparent_72%)] blur-xl" />
      {/* planet body */}
      <div className="absolute inset-[18%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_32%_28%,#17254a,#0a1020_55%,#070912)] shadow-[inset_-30px_-30px_80px_rgb(0_0_0/0.6),0_0_80px_rgb(56_189_248/0.12)]" />
      {/* rings */}
      <div className="orbit-slow absolute inset-[6%] rounded-full border border-electric/20">
        <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow shadow-[0_0_14px_var(--color-cyan-glow)]" />
      </div>
      <div className="orbit-slower absolute inset-0 rounded-full border border-dashed border-violet/25">
        <span className="absolute bottom-[14%] right-[8%] size-1.5 rounded-full bg-violet shadow-[0_0_12px_var(--color-violet)]" />
      </div>
      <div className="absolute inset-[-6%] rounded-full border border-white/5" />
    </div>
  )
}
