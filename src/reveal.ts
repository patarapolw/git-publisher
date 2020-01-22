import RevealMd from '@patarapolw/reveal-md-core'

import '@patarapolw/reveal-md-core/umd/index.css'
import MakeHtml from './make-html'
import { CONFIG, REPO, externalJs } from './global'

async function main () {
  const url = new URL(location.href)
  const filePath = url.searchParams.get('filePath')
  let placeHolder = ''

  if (filePath) {
    document.getElementsByTagName('title')[0].innerText = `${process.env.VUE_APP_TITLE}: ${filePath}`

    let fetchUrl = `https://raw.githubusercontent.com/${REPO}/${CONFIG.branch}/data/${filePath}`
    if (process.env.NODE_ENV !== 'production') {
      fetchUrl = `${process.env.BASE_URL}local/${filePath}`
    }

    placeHolder = await fetch(fetchUrl).then((r) => r.text())
  }

  externalJs.onReady(() => {
    const make = new MakeHtml()

    new RevealMd(
      (s, ext) => {
        return make.make(s, ext ? `.${ext}` : '.md')
      },
      null,
      placeHolder,
    )
  })
}

main()
