import showdown from 'showdown'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import h from 'hyperscript'

import { mdExt } from './ext'

const mdConverter = new showdown.Converter()
mdConverter.setFlavor('github')
let isInit = false

export function mdConvert (s: string) {
  if (!isInit) {
    Object.entries(mdExt).map(([name, x]) => mdConverter.addExtension(x, name))
    isInit = true
  }

  const { data, content } = matter(s)

  return (Object.keys(data).length > 0 ? h('details', {
    style: 'margin-bottom: 2em',
  }, [
    h('summary', [
      h('strong', data.title),
    ]),
    h('pre', [
      h('code.language-yaml', yaml.safeDump(data)),
    ]),
  ]).outerHTML : '') + mdConverter.makeHtml(content)
}
