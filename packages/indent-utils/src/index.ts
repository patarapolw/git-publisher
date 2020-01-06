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

/**
 * Create indented filter to be used in Showdown Extension / Pug Filters
 *
 * ^^ is implied to be the start of the tag
 *
 * To end the tag, use ^^ to end the parsing, but this is optional and it
 * will end anyways on the end of the line (\\n)
 *
 * @param tag tag name to be used in indented filter
 * @param fn How should the result be parsed
 */
export function createIndentedFilter (tag: string, fn: (s: string, attrs: {
  [k: string]: string
}) => string) {
  const eqdictParser = require('eqdict').default

  return (text: string) => {
    const replacement: {s: string; attrs: any; start: number; end: number}[] = []
    const tagRegex = new RegExp(`${escapeRegExp(`^^${tag}`)}(?:[. \\n()]|$)`)

    let lastPos = 0
    let currentPos = text.search(tagRegex)

    while (currentPos !== -1) {
      const indentStr = text.substr(lastPos, currentPos - lastPos).match(/(?:^|\n)(.*)$/)
      const indentSize = indentStr ? indentStr[1].length : 0

      lastPos = currentPos + (tag.length + 2)
      let nextSegment = text.substr(lastPos)

      let bracketDepth = 0
      const eqDictStr: string[] = []
      for (const c of nextSegment.split('')) {
        if (c === '(') {
          bracketDepth++
          continue
        } else if (c === ')') {
          bracketDepth--
        }

        if (bracketDepth > 0) {
          eqDictStr.push(c)
        } else if (bracketDepth <= 0) {
          break
        }
      }

      let attrs: any = {}

      if (eqDictStr.length > 0) {
        const eqDict = eqDictStr.join('')
        attrs = eqdictParser(eqDict)

        lastPos += eqDict.length + 2
        nextSegment = text.substr(lastPos)
      }

      if (nextSegment[0] === '.') {
        let isFirst = true
        const contents: string[] = []
        for (const row of nextSegment.split('\n')) {
          if (!isFirst) {
            if (!/\S/.test(row) || /^\s+$/.test(row.substr(0, indentSize + 1))) {
              contents.push(row)
            } else {
              break
            }
          }

          lastPos += row.length + 1
          isFirst = false
        }

        replacement.push({
          s: stripIndent(contents.join('\n')),
          attrs,
          start: currentPos,
          end: lastPos,
        })
      } else {
        let row = nextSegment.split('\n')[0]
        const endIndex = row.indexOf('^^')
        if (endIndex !== -1) {
          row = row.substr(0, endIndex)
          lastPos += row.length + 2
        } else {
          lastPos += row.length
        }

        replacement.push({
          s: stripIndent(row),
          attrs,
          start: currentPos,
          end: lastPos,
        })
      }

      currentPos = regexIndexOf(text, tagRegex, lastPos + 1)
    };

    const segments: string[] = []
    let start = 0
    for (const r of replacement) {
      segments.push(text.substr(start, r.start - start))
      segments.push(fn(r.s, r.attrs))

      start = r.end
    }

    segments.push(text.substr(start))

    return segments.join('')
  }
}

function escapeRegExp (s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function regexIndexOf (text: string, re: RegExp, i: number) {
  var indexInSuffix = text.slice(i).search(re)
  return indexInSuffix < 0 ? indexInSuffix : indexInSuffix + i
}
