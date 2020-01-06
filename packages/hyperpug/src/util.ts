export function getIndent (s: string) {
  const indents: number[] = []
  for (const r of s.split('\n')) {
    if (r.trim()) {
      const m = /^ */.exec(r)
      if (m) {
        indents.push(m[0].length)
      }
    }
  }

  if (indents.length === 0) {
    indents.push(0)
  }

  return Math.min(...indents)
}

export function stripIndent (s: string) {
  const indent = getIndent(s)
  return s.split('\n').map((r) => r.substr(indent)).join('\n')
}

export function eqDict (s: string) {
  let k = ''
  let v = ''

  const output: Record<string, string> = {}

  while (s.length > 0) {
    [k, s] = eqDictConsume(s)

    if (k) {
      if (s[0] === '=') {
        [v, s] = eqDictConsume(s)
        output[k] = v
      } else {
        output[k] = ''
      }

      k = ''
    }
  }

  return output
}

function eqDictConsume (s: string) {
  s = s.replace(/^[ =,\s]+/, '')

  if (!s) {
    return ['', '']
  } else {
    if (s[0] === '"' || s[0] === "'") {
      let iSplitter = s.length
      s.split('').forEach((c, i) => {
        if (i > 0) {
          if (c === s[0] && s.substr(i - 1, 1) !== '\\' && iSplitter === s.length) {
            iSplitter = i
          }
        }
      })

      return [s.substr(1, iSplitter - 1), s.substr(iSplitter + 1)]
    } else {
      let iSplitter = s.length
      s.split('').forEach((c, i) => {
        if (/[=,\s]/.test(c) && iSplitter === s.length) {
          iSplitter = i
        }
      })

      return [s.substr(0, iSplitter), s.substr(iSplitter)]
    }
  }
}
