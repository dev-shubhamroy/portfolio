/**
 * Shared visual vocabulary for every diagram and 3D marker on the site:
 * blue is the primary signal, violet the secondary, cyan a rare accent.
 */
export const palette = {
  blue: '#38bdf8',
  blueSoft: '#7dd3fc',
  violet: '#8b5cf6',
  violetSoft: '#c4b5fd',
  cyan: '#22d3ee',
  ink: '#0a1020',
  inkDeep: '#070912',
  line: 'rgb(255 255 255 / 0.18)',
  faint: 'rgb(255 255 255 / 0.08)',
  text: 'rgb(226 232 240)',
  muted: 'rgb(148 163 184)',
} as const

export type Tone = 'blue' | 'violet' | 'cyan' | 'neutral'

export const toneColor: Record<Tone, string> = {
  blue: palette.blue,
  violet: palette.violet,
  cyan: palette.cyan,
  neutral: 'rgb(255 255 255 / 0.3)',
}

export const toneSoft: Record<Tone, string> = {
  blue: palette.blueSoft,
  violet: palette.violetSoft,
  cyan: '#67e8f9',
  neutral: palette.text,
}

export const mono = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
} as const
