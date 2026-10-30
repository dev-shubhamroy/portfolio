import type { VisualKind } from '../../data/projects'

/** Per-project accent pair (as "r g b" triples) shared by cards, satellites and the code window. */
export const accents: Record<VisualKind, { accent: string; accent2: string }> = {
  retail: { accent: '56 189 248', accent2: '139 92 246' },
  branch: { accent: '34 211 238', accent2: '56 189 248' },
  shortener: { accent: '167 139 250', accent2: '56 189 248' },
}
