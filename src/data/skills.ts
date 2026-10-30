import { projects } from './projects'

// Skills constellation data. A technology only appears if the featured
// projects' data (projects.ts) or this portfolio's own package.json support it:
//  - `techKey` links a node to every project whose `tech` list contains it, so
//    those relationships come straight from the project data;
//  - `portfolio` marks technologies used to build this site (package.json);
//  - `projectIds` is only for concepts the data names in prose (RAG).
// FastAPI was requested but appears in none of the repositories, so it is left out.

export type GroupId = 'frontend' | 'backend' | 'data' | 'systems' | 'ai'

export const groups: { id: GroupId; label: string; tone: 'blue' | 'violet' | 'cyan' }[] = [
  { id: 'frontend', label: 'Frontend', tone: 'blue' },
  { id: 'backend', label: 'Backend', tone: 'violet' },
  { id: 'data', label: 'Databases and caching', tone: 'cyan' },
  { id: 'systems', label: 'Systems programming', tone: 'blue' },
  { id: 'ai', label: 'AI tooling', tone: 'violet' },
]

export interface SkillNode {
  id: string
  label: string
  group: GroupId
  /** position in the constellation, 0-100 on both axes */
  x: number
  y: number
  description: string
  usage: string
  techKey?: string
  portfolio?: boolean
  projectIds?: string[]
}

export const skills: SkillNode[] = [
  { id: 'typescript', label: 'TypeScript', group: 'frontend', x: 8, y: 14, portfolio: true,
    description: 'JavaScript with static types.',
    usage: 'Every component in this portfolio is written in TypeScript.' },
  { id: 'react', label: 'React', group: 'frontend', x: 30, y: 18, techKey: 'React', portfolio: true,
    description: 'Library for building component-based user interfaces.',
    usage: "The front end of RetailPulseAI, and the UI of this portfolio." },
  { id: 'vite', label: 'Vite', group: 'frontend', x: 30, y: 50, techKey: 'Vite', portfolio: true,
    description: 'Fast development server and bundler.',
    usage: "Build tooling for RetailPulseAI's front end and this portfolio." },
  { id: 'tailwind', label: 'Tailwind CSS', group: 'frontend', x: 30, y: 80, techKey: 'Tailwind CSS', portfolio: true,
    description: 'Utility-first CSS framework.',
    usage: "Styling for RetailPulseAI's front end and this portfolio." },
  { id: 'three', label: 'Three.js', group: 'frontend', x: 8, y: 84, portfolio: true,
    description: 'WebGL 3D library, used here through React Three Fiber and Drei.',
    usage: "Powers the interactive Earth and the project satellites in this portfolio's hero." },

  { id: 'node', label: 'Node.js', group: 'backend', x: 68, y: 32, techKey: 'Node.js',
    description: 'JavaScript runtime for server-side code.',
    usage: 'Runs the RetailPulseAI backend and the URL Shortener.' },
  { id: 'express', label: 'Express', group: 'backend', x: 70, y: 58, techKey: 'Express',
    description: 'Minimal web framework for Node.js APIs.',
    usage: "The HTTP layer of RetailPulseAI's API and of the URL Shortener." },

  { id: 'postgres', label: 'PostgreSQL', group: 'data', x: 62, y: 78, techKey: 'PostgreSQL',
    description: 'Open-source relational database.',
    usage: "Stores RetailPulseAI's catalog, policies and inventory, and the URL Shortener's links." },
  { id: 'redis', label: 'Redis', group: 'data', x: 92, y: 82, techKey: 'Redis',
    description: 'In-memory data store, used here as a cache.',
    usage: 'Caches short-code lookups for one hour in the URL Shortener.' },
  { id: 'pgvector', label: 'pgvector', group: 'data', x: 44, y: 88, techKey: 'pgvector',
    description: 'PostgreSQL extension for storing and searching vector embeddings.',
    usage: "Holds RetailPulseAI's policy-passage embeddings for similarity search." },

  { id: 'rust', label: 'Rust', group: 'systems', x: 80, y: 10, techKey: 'Rust',
    description: 'Systems programming language focused on safety and performance.',
    usage: 'BranchForge is written in Rust.' },

  { id: 'ollama', label: 'Ollama', group: 'ai', x: 44, y: 8, techKey: 'Ollama',
    description: 'Runs language and embedding models locally.',
    usage: 'RetailPulseAI uses it for local chat and embedding models.' },
  { id: 'rag', label: 'RAG', group: 'ai', x: 66, y: 10, projectIds: ['retailpulse-ai'],
    description: 'Retrieval-Augmented Generation: fetch relevant passages first, then answer from them.',
    usage: "RetailPulseAI's policy Q&A retrieves policy passages and answers with citations." },
]

/** Project stars shown as hubs; the portfolio itself is the fourth. */
export const hubs: { id: string; label: string; href: string; x: number; y: number; alignEnd?: boolean }[] = [
  { id: 'portfolio', label: 'This portfolio', href: '#top', x: 14, y: 50 },
  { id: 'retailpulse-ai', label: 'RetailPulseAI', href: '#retailpulse-ai', x: 52, y: 50 },
  { id: 'url-shortener', label: 'URL Shortener', href: '#url-shortener', x: 86, y: 60 },
  { id: 'branchforge', label: 'BranchForge', href: '#branchforge', x: 92, y: 26, alignEnd: true },
]

/** Where a technology is used: project ids (from project data) plus the portfolio. */
export function usedIn(node: SkillNode): string[] {
  const ids = new Set<string>(node.projectIds ?? [])
  if (node.techKey) for (const p of projects) if (p.tech.includes(node.techKey)) ids.add(p.id)
  if (node.portfolio) ids.add('portfolio')
  return [...ids]
}
