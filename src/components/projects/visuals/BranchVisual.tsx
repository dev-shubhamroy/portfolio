import { FlowLine, Mono, NodeBox, Pulse } from '../../diagram/primitives'
import { palette } from '../../diagram/tokens'

// Schematic of BranchForge: one repository, one worktree per branch (layout
// names come from its README), and a supervised job whose states follow the
// README's lifecycle table. Nothing here reflects a real repository.
const TRUNK_X = 34
const WORKTREES = [
  { y: 52, name: 'feature/login' },
  { y: 108, name: 'hotfix' },
  { y: 164, name: 'existing-branch' },
]
const branchPath = (cy: number) => `M${TRUNK_X} ${cy} C${TRUNK_X + 28} ${cy} ${TRUNK_X + 22} ${cy} 92 ${cy}`

/** Decorative: git worktrees plus a supervised job lifecycle. Not a screenshot. */
export default function BranchVisual() {
  const toSupervisor = 'M196 66 C212 66 206 52 224 52'
  return (
    <svg viewBox="0 0 360 225" className="h-full w-full" fill="none" aria-hidden>
      {/* repository trunk */}
      <line x1={TRUNK_X} y1="30" x2={TRUNK_X} y2="196" stroke={palette.line} strokeWidth="1.5" />
      {[30, 80, 136, 192].map((y) => (
        <circle key={y} cx={TRUNK_X} cy={y} r="4.5" fill={palette.inkDeep} stroke="rgb(255 255 255 / 0.55)" strokeWidth="1.5" />
      ))}
      <Mono x={14} y={216} size={7.5}>repo</Mono>

      <Mono x={92} y={36} size={7.5}>app.worktrees/</Mono>
      {WORKTREES.map((w, i) => (
        <g key={w.name}>
          <FlowLine d={branchPath(w.y + 14)} tone="cyan" />
          <NodeBox x={92} y={w.y} w={104} h={28} label={w.name} tone={i === 0 ? 'cyan' : 'neutral'} fontSize={8.5} />
          <Pulse d={branchPath(w.y + 14)} tone="cyan" dur={4.5} delay={i * 1.2} />
        </g>
      ))}

      {/* run -> supervisor */}
      <FlowLine d={toSupervisor} tone="blue" />
      <Mono x={199} y={61} size={7}>run</Mono>
      <NodeBox x={224} y={36} w={122} h={32} label="supervisor" sub="holds flock" tone="blue" fontSize={9} />
      <Pulse d={toSupervisor} tone="blue" dur={3.2} delay={0.6} />

      {/* job states: starting -> running -> succeeded | failed | stopped */}
      <Mono x={224} y={86} size={7.5}>JOB STATE</Mono>
      <NodeBox x={224} y={92} w={56} h={20} label="starting" tone="neutral" seqDelay={0} fontSize={8} />
      <NodeBox x={290} y={92} w={56} h={20} label="running" tone="blue" seqDelay={3} fontSize={8} />
      <path d="M280 102 H290" stroke={palette.line} />
      <path d="M318 112 V126" stroke={palette.line} />
      <NodeBox x={224} y={126} w={62} h={20} label="succeeded" tone="cyan" seqDelay={6} fontSize={8} />
      <NodeBox x={292} y={126} w={54} h={20} label="failed" tone="violet" fontSize={8} />
      <NodeBox x={224} y={154} w={62} h={20} label="stopped" tone="neutral" fontSize={8} />
      <path d="M318 126 H286 M318 126 H292 M318 126 V140 H255 V154" stroke={palette.faint} />
      <Mono x={224} y={192} size={7}>running = lock held,</Mono>
      <Mono x={224} y={202} size={7}>not a stored PID</Mono>
    </svg>
  )
}
