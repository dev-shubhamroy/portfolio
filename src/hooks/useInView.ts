import { useEffect, useState, type RefObject } from 'react'

/** True while the referenced element intersects the viewport. */
export function useInView(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return inView
}
