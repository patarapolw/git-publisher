import showdown from 'showdown'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import h from 'hyperscript'

import getExtensions from './ext'

const mdConverter = new showdown.Converter()
mdConverter.setFlavor('github')
let isInit = false

export function mdConvert (s: string) {
  if (!isInit) {
    Object.entries(getExtensions().markdown).map(([name, x]) => mdConverter.addExtension(x, name))
    isInit = true
  }

  const { data, content } = matter(s)

  return h('div', [
    ...(Object.keys(data).length > 0 ? [
      h('details', {
        style: 'margin-bottom: 2em',
      }, [
        h('summary', [
          h('strong', data.title),
        ]),
        h('pre', [
          h('code.language-yaml', yaml.safeDump(data)),
        ]),
      ]),
    ] : []),
    h('main', { innerHTML: mdConverter.makeHtml(content) }),
  ]).outerHTML
}
