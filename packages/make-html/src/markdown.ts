import showdown from 'showdown'

import { mdExt } from './ext'

const mdConverter = new showdown.Converter()
let isInit = false

export function mdConvert (s: string) {
  if (!isInit) {
    Object.entries(mdExt).map(([name, x]) => mdConverter.addExtension(x, name))
    isInit = true
  }

  return mdConverter.makeHtml(s)
}
