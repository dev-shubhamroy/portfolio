import { Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import type { VisualKind } from '../../data/projects'
import { palette } from '../diagram/tokens'

type P3 = [number, number, number]
type Tone = 'blue' | 'violet' | 'cyan' | 'white'

interface Cluster {
  nodes: { p: P3; tone: Tone; size?: number }[]
  edges: [number, number][]
  /** polyline a light travels along, as node indices */
  route: number[]
  tone: Tone
}

// Each satellite is a tiny schematic of its project, drawn in the same
// vocabulary as the card illustrations. They are metaphors, not live views.
const clusters: Record<VisualKind, Cluster> = {
  // connected product nodes around a recommendation hub
  retail: {
    tone: 'blue',
    nodes: [
      { p: [0, 0, 0], tone: 'violet', size: 1.4 },
      { p: [-1, 0.65, 0], tone: 'blue' },
      { p: [0.95, 0.75, 0], tone: 'blue' },
      { p: [-0.7, -0.85, 0], tone: 'blue' },
      { p: [1.05, -0.5, 0], tone: 'blue' },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    route: [1, 0, 2, 0, 4, 0, 3, 0],
  },
  // one trunk splitting into worktree branches
  branch: {
    tone: 'cyan',
    nodes: [
      { p: [-1.2, 0, 0], tone: 'white' },
      { p: [-0.1, 0, 0], tone: 'cyan', size: 1.3 },
      { p: [1.1, 0.85, 0], tone: 'cyan' },
      { p: [1.25, 0, 0], tone: 'cyan' },
      { p: [1.1, -0.85, 0], tone: 'violet' },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
    route: [0, 1, 2, 1, 0, 1, 3, 1, 0, 1, 4, 1],
  },
  // request -> Redis -> PostgreSQL -> redirect
  shortener: {
    tone: 'violet',
    nodes: [
      { p: [-1.25, 0, 0], tone: 'white' },
      { p: [-0.42, 0.55, 0], tone: 'blue' },
      { p: [0.42, -0.55, 0], tone: 'violet' },
      { p: [1.25, 0, 0], tone: 'cyan' },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    route: [0, 1, 2, 3],
  },
}

const toneColor: Record<Tone, string> = {
  blue: palette.blue,
  violet: palette.violet,
  cyan: palette.cyan,
  white: '#e2e8f0',
}

const SCALE = 0.19

interface Props {
  kind: VisualKind
  id: string
  highlight: RefObject<string | null>
  animate: boolean
}

export default function ProjectSatellite({ kind, id, highlight, animate }: Props) {
  const cluster = clusters[kind]
  const body = useRef<THREE.Group>(null)
  const pulse = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)

  const route = useMemo(() => cluster.route.map((i) => new THREE.Vector3(...cluster.nodes[i].p)), [cluster])
  const lines = useMemo(() => {
    const pos: number[] = []
    for (const [a, b] of cluster.edges) pos.push(...cluster.nodes[a].p, ...cluster.nodes[b].p)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    return g
  }, [cluster])
  useEffect(() => () => lines.dispose(), [lines])

  useFrame((state, delta) => {
    if (!animate) return
    const on = highlight.current === id
    if (body.current) {
      const target = on ? SCALE * 1.45 : SCALE
      body.current.scale.setScalar(THREE.MathUtils.damp(body.current.scale.x, target, 6, Math.min(delta, 0.05)))
    }
    if (halo.current) {
      ;(halo.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.damp(
        (halo.current.material as THREE.MeshBasicMaterial).opacity,
        on ? 0.3 : 0.14,
        6,
        Math.min(delta, 0.05),
      )
    }
    if (pulse.current) {
      // the light walks the route one segment at a time
      const segs = route.length - 1
      const f = (state.clock.elapsedTime * 0.45) % segs
      const i = Math.floor(f)
      pulse.current.position.lerpVectors(route[i], route[i + 1], f - i)
    }
  })

  return (
    <Billboard>
      <group ref={body} scale={SCALE}>
        <mesh ref={halo}>
          <circleGeometry args={[1.7, 24]} />
          <meshBasicMaterial
            color={toneColor[cluster.tone]}
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={lines}>
          <lineBasicMaterial color={toneColor[cluster.tone]} transparent opacity={0.95} />
        </lineSegments>
        {cluster.nodes.map((n, i) => (
          <mesh key={i} position={n.p}>
            <circleGeometry args={[0.12 * (n.size ?? 1), 14]} />
            <meshBasicMaterial color={toneColor[n.tone]} />
          </mesh>
        ))}
        <mesh ref={pulse} position={cluster.nodes[cluster.route[0]].p}>
          <circleGeometry args={[0.075, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
        </mesh>
      </group>
    </Billboard>
  )
}
