import { ExternalLink, X } from 'lucide-react'
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { snippetsFor, snippetUrl } from '../../data/codeSnippets'
import type { Project } from '../../data/projects'
import { highlight } from '../../utils/highlight'

const LANGUAGE = { js: 'JavaScript', rust: 'Rust' } as const

/**
 * Editor-style window showing real excerpts from a project's repository.
 * Lazy-loaded the first time a card's "Explore code" is opened. The code is
 * static text: nothing here runs or connects to anything.
 */
export default function CodePreview({ project, onClose }: { project: Project; onClose: () => void }) {
  const snippets = useMemo(() => snippetsFor(project.id), [project.id])
  const [index, setIndex] = useState(0)
  const baseId = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const snippet = snippets[index]

  const lines = useMemo(() => snippet.code.split('\n'), [snippet])
  const tokens = useMemo(() => highlight(lines, snippet.language), [lines, snippet.language])
  const fileName = snippet.path.split('/').pop()

  const onKeyDown = (e: KeyboardEvent) => {
    const next =
      e.key === 'ArrowRight' ? (index + 1) % snippets.length
      : e.key === 'ArrowLeft' ? (index - 1 + snippets.length) % snippets.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? snippets.length - 1
      : null
    if (next === null) return
    e.preventDefault()
    setIndex(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="code-window overflow-hidden rounded-2xl border border-white/10 bg-ink-950/80 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.8)]">
      {/* title bar with file tabs */}
      <div className="flex items-end gap-3 border-b border-white/10 bg-white/[0.03] px-3 pt-2.5">
        <div aria-hidden className="mb-3 flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <div role="tablist" aria-label={`${project.name} code excerpts`} className="-mb-px flex min-w-0 gap-1 overflow-x-auto" onKeyDown={onKeyDown}>
          {snippets.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              role="tab"
              id={`${baseId}-tab-${s.id}`}
              aria-selected={i === index}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              className="code-tab min-h-10 shrink-0 rounded-t-lg border border-b-0 px-3 font-mono text-[0.7rem] whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-electric"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 pb-1.5">
          <span className="hidden font-mono text-[0.68rem] text-[rgb(var(--accent))] sm:inline">{project.name}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close code preview"
            className="grid size-10 place-items-center rounded-md text-slate-500 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-electric"
          >
            <X size={15} aria-hidden />
          </button>
        </div>
      </div>

      {/* file path bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/5 px-4 py-2 font-mono text-[0.68rem] text-slate-500">
        <span className="min-w-0 truncate text-slate-400">
          <span className="text-slate-500">{snippet.repo}/</span>
          {snippet.path}
        </span>
        <span className="shrink-0">
          lines {snippet.startLine}–{snippet.endLine} · {LANGUAGE[snippet.language]}
        </span>
      </div>

      {/* code */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${snippet.id}`}
      >
        <div
          tabIndex={0}
          role="region"
          aria-label={`Code excerpt from ${fileName}, lines ${snippet.startLine} to ${snippet.endLine}`}
          className="code-scroll max-h-[22rem] overflow-auto py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-electric"
        >
          <pre key={snippet.id} className="code-in m-0 w-max min-w-full font-mono text-[0.72rem] leading-[1.7] sm:text-[0.78rem]">
            <code>
              {tokens.map((line, n) => (
                <span key={n} className="code-line" data-ln={snippet.startLine + n}>
                  {line.length === 0 ? '\n' : line.map((t, k) => <span key={k} className={`tok-${t.type}`}>{t.text}</span>)}
                  {line.length > 0 ? '\n' : ''}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* provenance and links */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-slate-500">
        <span>Excerpt from the repository, shown as text (not running code).</span>
        <span className="flex flex-wrap gap-x-4">
          <a
            href={snippetUrl(snippet)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1 rounded text-electric hover:underline focus-visible:outline-2 focus-visible:outline-electric"
          >
            View these lines on GitHub <ExternalLink size={12} aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1 rounded text-slate-300 hover:underline focus-visible:outline-2 focus-visible:outline-electric"
          >
            Full repository <ExternalLink size={12} aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </span>
      </div>
    </div>
  )
}
