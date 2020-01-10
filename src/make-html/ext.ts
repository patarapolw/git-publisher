import { IHyperPugFilters } from 'hyperpug'
import { ShowdownExtension } from 'showdown'
import { createIndentedFilter } from 'indent-utils'
// eslint-disable-next-line import/default
import dotProp from 'dot-prop'

import { mdConvert } from './markdown'
import { pugConvert } from './pug'

export default function getExtensions () {
  const pug: IHyperPugFilters = {
    markdown: (s: string) => mdConvert(s),
    css: (s: string) => {
      const style = document.createElement('style')
      style.setAttribute('data-content', s)
      return style.outerHTML
    },
    ...(dotProp.get(window, 'gitPublisher.makeHtml.plugins.pug') || {}),
  }

  const markdown: {
    [name: string]: ShowdownExtension
  } = {
    pug: {
      type: 'lang',
      filter: createIndentedFilter('pug', (s) => {
        return pugConvert(s)
      }),
    },
    css: {
      type: 'lang',
      filter: createIndentedFilter('css', (s) => {
        const style = document.createElement('style')
        style.setAttribute('data-content', s)
        return style.outerHTML
      }),
    },
    ...(dotProp.get(window, 'gitPublisher.makeHtml.plugins.markdown') || {}),
  }

  return {
    pug,
    markdown,
  }
}
