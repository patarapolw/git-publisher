import qs from 'querystring'

import { IHyperPugFilters } from 'hyperpug'
import { ShowdownExtension } from 'showdown'
import { createIndentedFilter } from 'indent-utils'
import h from 'hyperscript'

import { mdConvert } from './markdown'
import { pugConvert } from './pug'

export const pugExt: IHyperPugFilters = {
  markdown: (s: string) => mdConvert(s),
}

export const mdExt: {
  [name: string]: ShowdownExtension
} = {
  speak: {
    type: 'lang',
    filter: createIndentedFilter('^^speak', (s, attrs: {
      lang?: string
      s?: string
    }) => {
      return h('span', {
        attrs: {
          onclick: `window.speak("${s || attrs.s || ''}", "${attrs.lang || ''}")`,
        },
      }, s || 'Click to speak').outerHTML
    }),
  },
  pug: {
    type: 'lang',
    filter: createIndentedFilter('^^pug', (s) => {
      return pugConvert(s)
    }),
  },
  simpleTable: {
    type: 'lang',
    filter (text) {
      const rowRegex = /(?:(?:^|\r?\n)(?:\| )?(?:(?:.* \| )+.+)*(?:.* \| )+.+(?: \|)?(?:$|\r?\n))+/m
      text = text.replace(rowRegex, (p0) => {
        return h('table.table', p0.trim().split('\n').map((pi) => {
          pi = pi.trim().replace(/^|/, '').replace(/|$/, '')
          return h('tr', pi.split(' | ').map((x) => x.trim()).map((qi) => {
            return h('td', qi)
          }))
        })).outerHTML
      })
      return text
    },
  },
  spoiler: {
    type: 'lang',
    filter: createIndentedFilter('^^spoiler', (s, attrs) => {
      return h('details', [
        ...(attrs.summary ? [
          h('summary', attrs.summary),
        ] : []),
        h('div', s),
      ]).outerHTML
    }),
  },
  slide: {
    type: 'lang',
    filter: createIndentedFilter('^^slide', (s, attrs) => {
      return h('a', {
        href: `https://patarapolw.github.io/reveal-md/reveal/?${qs.stringify({
          q: (() => {
            let q = s
            if (attrs.github) {
              q = `https://raw.githubusercontent.com/${attrs.github}/master/${s}`
            }
            return q
          })(),
        })}`,
      }, s).outerHTML
    }),
  },
}

declare global {
  interface Window {
    speak(s: string, lang: string): void
  }
}

if (typeof window !== 'undefined') {
  window.speak = (s, lang) => {
    let trueLang = ''

    const voices = speechSynthesis.getVoices()
    const [la1, la2] = lang.split(/-_/)
    if (la2) {
      const langRegex = new RegExp(`${la1}[-_]${la2}`, 'i')
      const matchedLang = voices.filter((v) => langRegex.test(v.lang))
      if (matchedLang.length > 0) {
        trueLang = matchedLang.sort((v1, v2) => v1.localService
          ? -1 : v2.localService ? 1 : 0)[0].lang
      }
    }
    if (!trueLang) {
      const langRegex = new RegExp(`^${la1}`, 'i')
      const matchedLang = voices.filter((v) => langRegex.test(v.lang))
      if (matchedLang.length > 0) {
        trueLang = matchedLang.sort((v1, v2) => v1.localService
          ? -1 : v2.localService ? 1 : 0)[0].lang
      }
    }

    if (trueLang) {
      const u = new SpeechSynthesisUtterance(s)
      u.lang = trueLang
      speechSynthesis.speak(u)
    }
  }
}
