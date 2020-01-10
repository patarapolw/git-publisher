import RevealMd from '@patarapolw/reveal-md-core'

import '@patarapolw/reveal-md-core/umd/index.css'
import MakeHtml from './make-html'
import { CONFIG, REPO } from './global'

async function main () {
  const url = new URL(location.href)
  const filePath = url.searchParams.get('filePath')
  let placeHolder = ''

  if (filePath) {
    document.getElementsByTagName('title')[0].innerText = `${process.env.VUE_APP_TITLE}: ${filePath}`

    let fetchUrl = `https://raw.githubusercontent.com/${REPO}/${CONFIG.branch}/${CONFIG.data}/${filePath}`
    if (process.env.NODE_ENV !== 'production') {
      fetchUrl = `${process.env.BASE_URL}data/${filePath}`
    }

    placeHolder = await fetch(fetchUrl).then((r) => r.text())
  }

  const make = new MakeHtml()

  new RevealMd(
    (s, ext) => {
      return make.make(s, ext ? ext.substr(1) : '.md')
    },
    '',
    placeHolder,
  )
}

main()