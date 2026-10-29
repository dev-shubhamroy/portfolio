import { Component, lazy, Suspense, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useInView } from '../../hooks/useInView'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import GlobePlaceholder from '../GlobePlaceholder'

// three.js is only downloaded when the globe is actually shown.
const GlobeScene = lazy(() => import('./GlobeScene'))

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Interactive 3D Earth. Falls back to the CSS placeholder if WebGL is unavailable or fails. */
interface Props {
  /** link overlays positioned over the 3D project satellites */
  markers: RefObject<(HTMLElement | null)[]>
  /** project id highlighted from the surrounding UI */
  highlight: RefObject<string | null>
}

export default function Globe({ markers, highlight }: Props) {
  const [supported] = useState(hasWebGL)
  const [failed, setFailed] = useState(false)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const smallScreen = useMediaQuery('(max-width: 640px)')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  if (!supported || failed) return <GlobePlaceholder />

  const lowPower = smallScreen || (navigator.hardwareConcurrency ?? 8) <= 4

  return (
    <div
      ref={ref}
      aria-hidden
      className="fade-in relative mx-auto aspect-square w-full max-w-[34rem] cursor-grab touch-pan-y select-none"
    >
      <div className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(56_189_248/0.14),rgb(139_92_246/0.08)_50%,transparent_72%)] blur-2xl" />
      <SceneBoundary onError={() => setFailed(true)}>
        <Suspense fallback={<GlobePlaceholder />}>
          <GlobeScene
            container={ref}
            active={inView}
            animate={!reducedMotion}
            lowPower={lowPower}
            markers={markers}
            highlight={highlight}
            onFail={() => setFailed(true)}
          />
        </Suspense>
      </SceneBoundary>
    </div>
  )
}
