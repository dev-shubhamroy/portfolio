import { PointMaterial } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { createLandMask } from './earthTexture'
import { buildNetwork, mulberry32, PLANET_RADIUS } from './network'
import { atmosphereFragment, atmosphereVertex, earthFragment, earthVertex } from './shaders'

interface Orbit {
  radius: number
  rotation: [number, number, number]
  color: string
  opacity: number
  /** [angular speed rad/s, start phase] for each satellite on this ring */
  satellites: [number, number][]
}

// Rings at different tilts and distances; satellites share one slow, coordinated pace.
const ORBITS: Orbit[] = [
  { radius: 1.5, rotation: [Math.PI / 2.3, 0.25, 0], color: '#38bdf8', opacity: 0.4, satellites: [[0.16, 0], [0.16, Math.PI]] },
  { radius: 1.66, rotation: [Math.PI / 2.8, -0.5, 0], color: '#8b5cf6', opacity: 0.34, satellites: [[-0.11, 1.2]] },
  { radius: 1.82, rotation: [Math.PI / 1.9, 0.9, 0.3], color: '#38bdf8', opacity: 0.18, satellites: [[0.08, 3.4]] },
]

const NODE_HUBS = new Set([0, 2, 5, 6]) // nodes that pulse a little more

const AUTO_SPEED = 0.035 // rad/s, roughly one turn every three minutes
const BASE_TILT = 0.38
const START_YAW = Math.PI - 0.2 // brings South Asia toward the camera

interface Props {
  /** Element that receives drag input; it matches the visible globe box. */
  container: RefObject<HTMLDivElement | null>
  active: boolean
  animate: boolean
  lowPower: boolean
  onFail: () => void
}

export default function GlobeScene({ container, active, animate, lowPower, onFail }: Props) {
  return (
    <Canvas
      // Slightly larger than the globe box so the atmosphere is never clipped;
      // a radial mask hides the canvas edge.
      className="pointer-events-none absolute inset-[-14%]"
      style={{ maskImage: 'radial-gradient(closest-side, #000 84%, transparent 100%)' }}
      frameloop={animate && active ? 'always' : 'demand'}
      camera={{ position: [0, 0, 6.6], fov: 35 }}
      dpr={[1, lowPower ? 1.5 : 2]}
      flat
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onFail()
        })
      }}
    >
      <GlobeContent container={container} animate={animate} lowPower={lowPower} />
    </Canvas>
  )
}

interface ContentProps {
  container: RefObject<HTMLDivElement | null>
  animate: boolean
  lowPower: boolean
}

function GlobeContent({ container, animate, lowPower }: ContentProps) {
  const tilt = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const dust = useRef<THREE.Group>(null)
  const pulses = useRef<(THREE.Group | null)[]>([])
  const halos = useRef<(THREE.Mesh | null)[]>([])
  const sats = useRef<(THREE.Group | null)[]>([])
  const earthMat = useRef<THREE.ShaderMaterial>(null)
  // Mutable input state; read inside useFrame so no React re-renders happen.
  const input = useRef({ px: 0, py: 0, dragging: false, lastX: 0, pending: 0, velocity: 0 })

  const network = useMemo(() => buildNetwork(lowPower ? 32 : 48), [lowPower])
  const mask = useMemo(() => createLandMask(lowPower ? 1024 : 2048), [lowPower])
  const earthUniforms = useMemo(
    () => ({
      uMask: { value: mask },
      uTexel: { value: new THREE.Vector2(1 / mask.image.width, 1 / mask.image.height) },
      uTime: { value: 0 },
      uNodes: { value: network.nodes.map((p) => p.clone().normalize()) },
    }),
    [mask, network],
  )
  const dustPositions = useMemo(() => {
    const rand = mulberry32(7)
    const count = lowPower ? 90 : 170
    const out = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2
      const cosPhi = rand() * 2 - 1
      const sinPhi = Math.sqrt(1 - cosPhi * cosPhi)
      const r = 1.6 + rand() * 0.9
      out.set([r * sinPhi * Math.cos(theta), r * cosPhi, r * sinPhi * Math.sin(theta)], i * 3)
    }
    return out
  }, [lowPower])

  const innerAtmosphere = useMemo(() => ({ uRange: { value: 0.62 }, uStrength: { value: 1.25 } }), [])
  const outerAtmosphere = useMemo(() => ({ uRange: { value: 0.5 }, uStrength: { value: 0.55 } }), [])

  useEffect(() => () => mask.dispose(), [mask])
  useEffect(() => () => network.geometry.dispose(), [network])

  useEffect(() => {
    const el = container.current
    if (!animate || !el) return
    const s = input.current

    const onWindowMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      s.px = (e.clientX / window.innerWidth - 0.5) * 2
      s.py = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onDown = (e: PointerEvent) => {
      s.dragging = true
      s.lastX = e.clientX
      s.velocity = 0
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return
      const d = (e.clientX - s.lastX) * 0.006
      s.lastX = e.clientX
      s.pending += d
      s.velocity = THREE.MathUtils.clamp(d, -0.05, 0.05)
    }
    const onUp = () => {
      s.dragging = false
      el.style.cursor = ''
    }

    window.addEventListener('pointermove', onWindowMove, { passive: true })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onWindowMove)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [container, animate])

  useFrame((state, delta) => {
    if (!animate) return
    const s = input.current
    const dt = Math.min(delta, 0.05)

    if (spin.current) {
      spin.current.rotation.y += s.pending
      s.pending = 0
      if (!s.dragging) {
        spin.current.rotation.y += AUTO_SPEED * dt + s.velocity
        s.velocity *= 0.92
      }
    }
    if (tilt.current) {
      tilt.current.rotation.x = THREE.MathUtils.damp(
        tilt.current.rotation.x,
        BASE_TILT + s.py * 0.08,
        3,
        dt,
      )
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, s.px * 0.2, 3, dt)
    }
    if (dust.current) dust.current.rotation.y += dt * 0.01

    const t = state.clock.elapsedTime
    if (earthMat.current) earthMat.current.uniforms.uTime.value = t

    network.arcs.forEach((pts, k) => {
      const pulse = pulses.current[k]
      if (!pulse) return
      const u = (t * 0.06 + k * 0.37) % 1
      pulse.position.copy(pts[Math.floor(u * (pts.length - 1))])
      pulse.scale.setScalar(Math.sin(Math.PI * u))
    })

    halos.current.forEach((halo, i) => {
      if (!halo) return
      const amp = NODE_HUBS.has(i) ? 0.35 : 0.12
      halo.scale.setScalar(1 + amp * Math.sin(t * 1.1 + i * 1.3))
    })

    let n = 0
    for (const orbit of ORBITS) {
      for (const [speed, phase] of orbit.satellites) {
        const sat = sats.current[n++]
        if (sat) sat.position.set(Math.cos(t * speed + phase) * orbit.radius, Math.sin(t * speed + phase) * orbit.radius, 0)
      }
    }
  })

  return (
    <group ref={tilt} rotation={[BASE_TILT, 0, 0]}>
      <group ref={spin} rotation={[0, START_YAW, 0]}>
        <mesh>
          <sphereGeometry args={[PLANET_RADIUS, lowPower ? 40 : 64, lowPower ? 40 : 64]} />
          <shaderMaterial
            ref={earthMat}
            vertexShader={earthVertex}
            fragmentShader={earthFragment}
            uniforms={earthUniforms}
          />
        </mesh>

        <lineSegments geometry={network.geometry}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {network.nodes.map((p, i) => (
          <group key={i} position={p}>
            <mesh>
              <sphereGeometry args={[0.014, 10, 10]} />
              <meshBasicMaterial color="#67e8f9" />
            </mesh>
            <mesh
              ref={(el) => {
                halos.current[i] = el
              }}
            >
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.18}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}

        {network.arcs.map((_, k) => (
          <group
            key={k}
            ref={(el) => {
              pulses.current[k] = el
            }}
          >
            <mesh>
              <sphereGeometry args={[0.013, 8, 8]} />
              <meshBasicMaterial color={k % 2 ? '#c4b5fd' : '#7dd3fc'} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshBasicMaterial
                color={k % 2 ? '#8b5cf6' : '#38bdf8'}
                transparent
                opacity={0.25}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* tight inner atmosphere + wider, fainter outer haze */}
      <mesh scale={1.16}>
        <sphereGeometry args={[PLANET_RADIUS, 48, 48]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={innerAtmosphere}
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.34}>
        <sphereGeometry args={[PLANET_RADIUS, 32, 32]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={outerAtmosphere}
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {ORBITS.map((orbit, oi) => (
        <group key={oi} rotation={orbit.rotation}>
          <mesh>
            <torusGeometry args={[orbit.radius, 0.0032, 6, 180]} />
            <meshBasicMaterial color={orbit.color} transparent opacity={orbit.opacity} />
          </mesh>
          {orbit.satellites.map(([, phase], si) => {
            const index = ORBITS.slice(0, oi).reduce((n, o) => n + o.satellites.length, 0) + si
            return (
              <group
                key={si}
                ref={(el) => {
                  sats.current[index] = el
                }}
                position={[Math.cos(phase) * orbit.radius, Math.sin(phase) * orbit.radius, 0]}
              >
                <mesh>
                  <sphereGeometry args={[0.024, 10, 10]} />
                  <meshBasicMaterial color={orbit.color === '#8b5cf6' ? '#ddd6fe' : '#bae6fd'} />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.07, 12, 12]} />
                  <meshBasicMaterial
                    color={orbit.color}
                    transparent
                    opacity={0.28}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}

      <group ref={dust}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          </bufferGeometry>
          <PointMaterial
            transparent
            color="#a5b4fc"
            size={0.035}
            sizeAttenuation
            depthWrite={false}
            opacity={0.55}
          />
        </points>
      </group>
    </group>
  )
}
