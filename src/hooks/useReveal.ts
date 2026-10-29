import { useEffect, useRef } from 'react'

/**
 * Sets `data-visible` on the element once it scrolls into view. The change is
 * made directly on the DOM node, so no React re-render is involved. CSS in
 * globals.css (`.reveal-on-scroll`) handles the transition and reduced motion.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = 'true'
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
