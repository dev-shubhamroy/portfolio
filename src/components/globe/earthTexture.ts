import * as THREE from 'three'
import landData from '../../data/land110m.json'

/**
 * Land polygons come from Natural Earth (public domain) via the `world-atlas`
 * land-110m TopoJSON, converted to plain [lon, lat] rings. See README "Credits".
 * They are rasterised here into an equirectangular land/ocean mask, so no
 * image file or external URL is needed.
 */
type Ring = [number, number][]
const polygons = landData as Ring[][]

export function createLandMask(width: number) {
  const height = width / 2
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#fff'

  for (const rings of polygons) {
    ctx.beginPath()
    for (const ring of rings) {
      ring.forEach(([lon, lat], i) => {
        const x = ((lon + 180) / 360) * width
        const y = ((90 - lat) / 180) * height
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
    }
    ctx.fill('evenodd')
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}
