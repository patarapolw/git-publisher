import scopeCss from 'scope-css'
import nanoid from 'nanoid'

import { mdConvert } from './markdown'
import { pugConvert } from './pug'

export default class MakeHtml {
  id = nanoid()

  make (s: string, ext?: string): string {
    if (ext === '.md') {
      s = mdConvert(s)
    } else if (ext === '.pug') {
      s = pugConvert(s)
    }

    const div = document.createElement('div')
    div.id = this.id
    div.innerHTML = s

    return div.outerHTML
  }

  activate () {
    Array.from(document.getElementsByTagName('style')).forEach((el) => {
      const content = el.getAttribute('content')
      if (content) {
        el.innerHTML = scopeCss(content, `#${this.id}`)
      }
    })
  }
}
