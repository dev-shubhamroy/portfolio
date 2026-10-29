import * as THREE from 'three'

export { mulberry32 } from '../../utils/random'

export const PLANET_RADIUS = 1.05

/** Generic world locations used only as decorative network nodes: [lat, lon]. */
const NODE_COORDS: [number, number][] = [
  [28.6, 77.2],
  [51.5, -0.1],
  [40.7, -74.0],
  [-23.5, -46.6],
  [6.5, 3.4],
  [1.35, 103.8],
  [35.7, 139.7],
  [-33.9, 151.2],
  [37.8, -122.4],
  [25.2, 55.3],
  [-33.9, 18.4],
  [52.5, 13.4],
]

const ARC_PAIRS: [number, number][] = [
  [0, 1],
  [0, 5],
  [0, 9],
  [1, 2],
  [2, 8],
  [8, 6],
  [6, 7],
  [5, 7],
  [1, 4],
  [4, 3],
  [3, 2],
  [9, 10],
]

/** Lat/lon to a point matching three.js SphereGeometry UV orientation. */
export function latLonToVector(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(lon + 180)
  const latR = THREE.MathUtils.degToRad(lat)
  return new THREE.Vector3(
    -Math.cos(phi) * Math.cos(latR),
    Math.sin(latR),
    Math.sin(phi) * Math.cos(latR),
  ).multiplyScalar(radius)
}

function arcPoints(a: THREE.Vector3, b: THREE.Vector3, segments: number) {
  const ua = a.clone().normalize()
  const ub = b.clone().normalize()
  const omega = Math.acos(THREE.MathUtils.clamp(ua.dot(ub), -1, 1))
  const lift = 0.06 + 0.3 * (omega / Math.PI)
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const s = Math.sin(omega)
    const p = ua
      .clone()
      .multiplyScalar(Math.sin((1 - t) * omega) / s)
      .add(ub.clone().multiplyScalar(Math.sin(t * omega) / s))
    points.push(p.multiplyScalar(PLANET_RADIUS * (1 + lift * Math.sin(Math.PI * t))))
  }
  return points
}

export function buildNetwork(segments = 48) {
  const nodes = NODE_COORDS.map(([lat, lon]) => latLonToVector(lat, lon, PLANET_RADIUS * 1.004))
  const arcs = ARC_PAIRS.map(([a, b]) => arcPoints(nodes[a], nodes[b], segments))

  // One LineSegments geometry for every arc keeps this to a single draw call.
  const positions: number[] = []
  const colors: number[] = []
  const blue = new THREE.Color('#38bdf8')
  const violet = new THREE.Color('#8b5cf6')
  const c = new THREE.Color()
  for (const pts of arcs) {
    for (let i = 0; i < pts.length - 1; i++) {
      for (const j of [i, i + 1]) {
        positions.push(pts[j].x, pts[j].y, pts[j].z)
        c.copy(blue).lerp(violet, j / segments)
        colors.push(c.r, c.g, c.b)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  return { nodes, arcs, geometry }
}
