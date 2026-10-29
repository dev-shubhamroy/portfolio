import { useEffect, useRef } from 'react'

/**
 * Sets `data-visible` once the element has scrolled into view (for the reveal
 * transition) and keeps `data-inview` in sync while it stays observed, so CSS
 * can pause decorative animations whenever it is offscreen. Both are written
 * straight to the DOM node, so no React re-render is involved.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.inview = entry.isIntersecting ? 'true' : 'false'
        if (entry.isIntersecting) el.dataset.visible = 'true'
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
