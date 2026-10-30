import { useEffect, useRef } from 'react'

/**
 * Progress through a list of sections, written straight to an element as
 * scaleY (no React re-renders). 0 is the first section's start and 1 is the
 * last section reached, with each chapter weighted equally, so the line lines
 * up with chapter markers spaced evenly along it.
 */
export function useChapterProgress<T extends HTMLElement>(ids: string[]) {
  const ref = useRef<T>(null)
  const key = ids.join(',')

  useEffect(() => {
    const sections = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length < 2) return

    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const line = window.innerHeight * 0.45
      const tops = sections.map((s) => s.getBoundingClientRect().top)
      let i = 0
      for (let k = 0; k < tops.length; k++) if (tops[k] <= line) i = k
      const end = i + 1 < tops.length ? tops[i + 1] : tops[i] + sections[i].offsetHeight
      const within = Math.min(Math.max((line - tops[i]) / Math.max(end - tops[i], 1), 0), 1)
      const progress = (i + (i === tops.length - 1 ? 0 : within)) / (sections.length - 1)
      el.style.transform = `scaleY(${Math.min(progress, 1)})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [key])

  return ref
}
