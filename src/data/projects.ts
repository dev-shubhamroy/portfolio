export type VisualKind = 'retail' | 'branch' | 'shortener'

export interface Project {
  id: string
  name: string
  /** Short label for the project's current state, taken from its repository. */
  status: string
  /** One-line summary for compact previews (hero satellites). */
  blurb: string
  description: string
  features: string[]
  tech: string[]
  repoUrl: string
  visual: VisualKind
  featured?: boolean
  /** Honest caveat from the repository, shown in small print. */
  note?: string
}

// All content below was checked against each repository's README, source and
// manifest files. Do not add claims (metrics, demos, planned features) that the
// repositories do not support.
export const projects: Project[] = [
  {
    id: 'retailpulse-ai',
    name: 'RetailPulseAI',
    status: 'Hackathon MVP',
    blurb:
      'Local-first retail assistant: validated product recommendations, cited policy answers and manager-approved stock changes.',
    description:
      'A local-first retail assistant that turns shopping requests into validated product searches, answers store-policy questions with citations, and keeps stock changes behind manager approval. The LLM interprets and explains; deterministic backend code validates, ranks and writes.',
    features: [
      'Product recommendations: the LLM extracts search criteria, then the backend validates them with Zod, filters by budget, store and stock, and ranks results deterministically.',
      'Policy Q&A (RAG) over pgvector embeddings generated with Ollama, citing policy title, version and section, and declining questions the policies do not support.',
      'Staff propose stock adjustments; only a manager approval changes inventory, using a database transaction with row locks and an audit log.',
      'Rule-based and keyword-search fallbacks when Ollama is not running.',
    ],
    tech: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'pgvector', 'Ollama', 'Zod'],
    repoUrl: 'https://github.com/dev-shubhamroy/RetailPulse-',
    visual: 'retail',
    featured: true,
    note: 'Manager approval uses a demo PIN, not real authentication. Integration tests stub Ollama.',
  },
  {
    id: 'branchforge',
    name: 'BranchForge',
    status: 'Rust CLI, v0.1.0',
    blurb:
      'Rust CLI that gives each Git branch its own worktree and runs supervised background jobs inside them.',
    description:
      'A Rust command-line tool that gives every Git branch its own worktree in a predictable layout, so parallel tasks do not share one working copy. It can also run long-lived commands in those worktrees as supervised background jobs.',
    features: [
      'new, list, status and remove commands; remove only deletes worktrees it can prove it created and refuses to discard uncommitted or ignored files without --force.',
      'run, jobs, logs and stop: background jobs with captured stdout and stderr, stopped via SIGTERM then SIGKILL on the process group.',
      'Job liveness is decided by a held file lock rather than a stored PID, so state cannot go stale.',
      'Integration tests run the real binary against temporary Git repositories.',
    ],
    tech: ['Rust', 'Clap', 'Serde', 'Git worktrees'],
    repoUrl: 'https://github.com/dev-shubhamroy/BranchForge',
    visual: 'branch',
    note: 'Job commands need a Unix-like system and have only been run on macOS.',
  },
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    status: 'Backend project',
    blurb:
      'Node.js and Express backend that shortens URLs, with Redis caching in front of PostgreSQL.',
    description:
      'A Node.js and Express backend that turns long URLs into short links and redirects visitors to the original destination. PostgreSQL stores every link, and Redis caches lookups so repeat redirects skip the database.',
    features: [
      'POST /api/shorten validates the URL, allows only HTTP and HTTPS, and stores a 7-character Nano ID code.',
      'GET /:shortCode checks Redis first, falls back to PostgreSQL on a miss, and caches the result for one hour.',
      'Clear 400, 404 and 500 error responses for invalid input, unknown codes and failures.',
    ],
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Nano ID'],
    repoUrl: 'https://github.com/dev-shubhamroy/url-shortener',
    visual: 'shortener',
    note: 'Not yet benchmarked; automated tests and analytics are listed as future work in its README.',
  },
]
