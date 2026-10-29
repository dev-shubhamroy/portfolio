// Every claim here is backed by the project data (src/data/projects.ts), the
// project repositories, or this portfolio's package.json. Do not add experience,
// metrics or skills that cannot be traced to one of those.

export const aboutIntro = [
  "I'm a final-year Mechanical Engineering student at Delhi Technological University, looking for software engineering internships and entry-level roles.",
  'Mechanical engineering trained me to break a problem into parts and work within constraints. I now apply that approach to software, where I enjoy building practical projects and solving technical problems.',
]

export const focusSentence = 'backend engineering, full-stack development and AI-powered applications'

export interface Highlight {
  title: string
  label: string
  body: string
  /** Matches a project id in projects.ts. */
  project: string
}

export const highlights: Highlight[] = [
  {
    label: 'Backend engineering',
    title: 'Caching and data flow',
    body: 'In my URL Shortener, redirects check Redis first and fall back to PostgreSQL, caching each lookup for one hour.',
    project: 'url-shortener',
  },
  {
    label: 'Full-stack development',
    title: 'From UI to database',
    body: 'RetailPulseAI pairs a React front end with an Express API and PostgreSQL, so a request travels the whole stack.',
    project: 'retailpulse-ai',
  },
  {
    label: 'AI-powered applications',
    title: 'AI with guardrails',
    body: 'In RetailPulseAI the LLM interprets and explains, while validation, ranking and stock changes stay in deterministic backend code.',
    project: 'retailpulse-ai',
  },
]

export interface SkillGroup {
  name: string
  items: string[]
}

/** Technologies actually used in the three featured projects. */
export const projectSkills: SkillGroup[] = [
  { name: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS'] },
  { name: 'Backend', items: ['Node.js', 'Express', 'Zod'] },
  { name: 'Data and caching', items: ['PostgreSQL', 'pgvector', 'Redis'] },
  { name: 'Systems', items: ['Rust', 'Clap', 'Serde', 'Git worktrees'] },
  { name: 'AI tooling', items: ['Ollama'] },
]

/** Used to build this portfolio (see package.json). */
export const portfolioStack = ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Three.js', 'React Three Fiber']
