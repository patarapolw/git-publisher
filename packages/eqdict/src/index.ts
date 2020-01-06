export default function eqdict (s: string) {
  let k = ''
  let v = ''

  const output: {
    [key: string]: string
  } = {}

  while (s.length > 0) {
    [k, s] = eqdictConsume(s)

    if (k) {
      if (Object.keys(output).includes(k)) {
        throw new Error(`Duplicated keys: ${k}`)
      }

      if (s[0] === '=') {
        [v, s] = eqdictConsume(s)
        output[k] = v
      } else {
        output[k] = ''
      }

      k = ''
    }
  }

  return output
}

function eqdictConsume (s: string) {
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
