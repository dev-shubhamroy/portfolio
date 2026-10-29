import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'copied' | 'failed'

/** Clipboard API with a textarea fallback for browsers or contexts without it. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    try {
      return document.execCommand('copy')
    } catch {
      return false
    } finally {
      area.remove()
    }
  }
}

export default function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    setStatus((await copyText(email)) ? 'copied' : 'failed')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), 2500)
  }

  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-electric/60 hover:bg-electric/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
      >
        {status === 'copied' ? <Check size={16} className="text-cyan-glow" /> : <Copy size={16} />}
        {status === 'copied' ? 'Copied' : 'Copy email'}
      </button>
      {/* Screen-reader and visual feedback; the region stays mounted so updates are announced. */}
      <span role="status" aria-live="polite" className="text-xs text-slate-400">
        {status === 'copied' && `Copied ${email} to clipboard`}
        {status === 'failed' && 'Could not copy. Please select the address and copy it manually.'}
      </span>
    </>
  )
}
