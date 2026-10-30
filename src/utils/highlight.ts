import type { CodeLanguage } from '../data/codeSnippets'

/** Tiny line-by-line syntax tokenizer for the two languages in the code previews. */
export type TokenType = 'kw' | 'str' | 'com' | 'num' | 'fn' | 'ty' | 'plain'
export interface Token {
  type: TokenType
  text: string
}

const KEYWORDS: Record<CodeLanguage, Set<string>> = {
  js: new Set(
    'const let var function async await return if else throw new try catch finally for of in import export from default class typeof instanceof null true false undefined'.split(' '),
  ),
  rust: new Set(
    'pub fn let mut match if else return impl struct enum use mod const static self Self as in for while loop unsafe where ref true false crate super dyn move'.split(' '),
  ),
}

const TYPES_RUST = new Set(['Some', 'None', 'Ok', 'Err', 'Result', 'Option', 'String', 'Vec', 'Path', 'PathBuf', 'Error'])

interface State {
  block: boolean
  template: boolean
}

/** Tokenize `lines`, carrying block-comment and template-string state across lines. */
export function highlight(lines: string[], language: CodeLanguage): Token[][] {
  const state: State = { block: false, template: false }
  return lines.map((line) => tokenizeLine(line, language, state))
}

function tokenizeLine(line: string, language: CodeLanguage, state: State): Token[] {
  const out: Token[] = []
  const push = (type: TokenType, text: string) => {
    if (!text) return
    const last = out[out.length - 1]
    if (last && last.type === type) last.text += text
    else out.push({ type, text })
  }

  let i = 0
  while (i < line.length) {
    if (state.block) {
      const end = line.indexOf('*/', i)
      if (end === -1) {
        push('com', line.slice(i))
        return out
      }
      push('com', line.slice(i, end + 2))
      i = end + 2
      state.block = false
      continue
    }
    if (state.template) {
      let j = i
      while (j < line.length && line[j] !== '`') j++
      push('str', line.slice(i, j < line.length ? j + 1 : j))
      i = j < line.length ? j + 1 : j
      if (j < line.length) state.template = false
      continue
    }

    const rest = line.slice(i)
    const c = line[i]

    if (rest.startsWith('//')) {
      push('com', rest)
      return out
    }
    if (language === 'js' && rest.startsWith('/*')) {
      const end = line.indexOf('*/', i + 2)
      if (end === -1) {
        state.block = true
        push('com', rest)
        return out
      }
      push('com', line.slice(i, end + 2))
      i = end + 2
      continue
    }
    if (language === 'js' && c === '`') {
      state.template = true
      push('str', '`')
      i++
      continue
    }
    if (c === '"' || (language === 'js' && c === "'")) {
      let j = i + 1
      while (j < line.length && line[j] !== c) j += line[j] === '\\' ? 2 : 1
      push('str', line.slice(i, j + 1))
      i = j + 1
      continue
    }
    const num = /^\d[\d_]*(\.\d+)?/.exec(rest)
    if (num && !/[A-Za-z_]/.test(line[i - 1] ?? '')) {
      push('num', num[0])
      i += num[0].length
      continue
    }
    const word = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest)
    if (word) {
      const w = word[0]
      const next = line[i + w.length]
      if (KEYWORDS[language].has(w)) push('kw', w)
      else if (language === 'rust' && (TYPES_RUST.has(w) || /^[A-Z]/.test(w))) push('ty', w)
      else if (next === '(' || (language === 'rust' && next === '!')) push('fn', w)
      else if (language === 'js' && /^[A-Z][A-Z0-9_]+$/.test(w)) push('ty', w)
      else push('plain', w)
      i += w.length
      continue
    }
    push('plain', c)
    i++
  }
  return out
}
