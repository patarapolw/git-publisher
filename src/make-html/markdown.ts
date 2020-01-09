import showdown from 'showdown'
import matter from 'gray-matter'

import { mdExt } from './ext'

const mdConverter = new showdown.Converter()
mdConverter.setFlavor('github')
let isInit = false

export function mdConvert (s: string) {
  if (!isInit) {
    Object.entries(mdExt).map(([name, x]) => mdConverter.addExtension(x, name))
    isInit = true
  }

  return mdConverter.makeHtml(matter(s).content)
}
