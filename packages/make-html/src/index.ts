import { mdConvert } from './markdown'
import { pugConvert } from './pug'

export default class MakeHtml {
  make (s: string, ext?: string): string {
    if (ext === '.md') {
      return mdConvert(s)
    } else if (ext === '.pug') {
      return pugConvert(s)
    }

    return s
  }

  activate () {
    if (typeof window !== 'undefined') {
      Array.from(document.getElementsByTagName('style')).forEach((el) => {
        const content = el.getAttribute('content')
        if (content) {
          el.innerHTML = content
        }
      })
    }
  }
}
