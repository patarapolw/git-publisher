import { Vue, Component } from 'vue-property-decorator'
import { Dree } from 'dree'
import deepfind from '@patarapolw/deepfind'
import h from 'hyperscript'
import matter from 'gray-matter'

import { REPO, DREE, CONFIG, externalJs } from '@/global'
import MakeHtml from '@/make-html'

@Component
export default class App extends Vue {
  githubUrl = `https://github.com/${REPO}`
  dree: Dree = DREE
  currentPath = '.'
  filePath = 'README.md'
  folderPath = '.'
  html = ''
  type: string | null = null

  updateMeta () {
    const title = `${this.filePath} - ${process.env.VUE_APP_TITLE}`
    const description = this.description

    document.getElementsByTagName('title')[0].innerText = title;
    (document.querySelector('[property="og:title"]') as any).content = title;
    (document.querySelector('[property="twitter:title"]') as any).content = title;

    (document.querySelector('[name="description"]') as any).content = description;
    (document.querySelector('[property="og:description"]') as any).content = description;
    (document.querySelector('[property="twitter:description"]') as any).content = description
  }

  get description () {
    const div = document.createElement('div')
    div.innerHTML = this.html
    return div.innerText.substr(0, 140)
  }

  get relativePathHtml () {
    if (this.folderPath === '.') {
      return h('a', { href: '#' }, '.').outerHTML
    } else {
      const pathArray = [
        h('a', { href: '#' }, '.'),
        ...this.folderPath.split('/').map((p) => h('a', { href: `#${p}` }, p)),
      ].reduce((a, el) => {
        return [
          ...a,
          h('span', '/'),
          el,
        ]
      }, [] as HTMLElement[])
      pathArray.shift()

      return h('span', pathArray).outerHTML
    }
  }

  get revealUrl () {
    return `${process.env.BASE_URL}reveal.html?filePath=${encodeURIComponent(this.filePath)}`
  }

  created () {
    this.currentPath = location.hash.replace(/^#/, '')
    window.addEventListener('hashchange', () => {
      this.currentPath = location.hash.replace(/^#/, '')
      this.$nextTick(() => {
        this.updatePath()
      })
    })
    this.$nextTick(() => {
      this.updatePath()
    })
  }

  updatePath () {
    this.currentPath = decodeURIComponent(this.currentPath)

    let d = deepfind(DREE, {
      relativePath: this.currentPath || '.',
    })[0] as Dree

    if (d.type !== 'directory') {
      this.filePath = this.currentPath
      this.folderPath = this.currentPath.replace(/(?:\/)?[^/]+$/, '') || '.'
      d = deepfind(DREE, {
        relativePath: this.folderPath,
      })[0] as Dree
    } else {
      this.filePath = './README.md'
      this.folderPath = this.currentPath || '.'
    }

    if (this.filePath.startsWith('./')) {
      if (d.relativePath === '.') {
        this.filePath = this.filePath.substr(2)
      } else if (d.type === 'directory') {
        this.filePath = `${d.relativePath}/${this.filePath.substr(2)}`
      }
    }

    (this.dree.children || [])
      .filter((el: any) => el.relativePath === this.filePath)
      .map((el: any) => { el.active = true })

    this.$set(this, 'dree', d)

    this.$nextTick(() => {
      this.updateFilePath()
    })
  }

  async updateFilePath () {
    let fetchUrl = `https://raw.githubusercontent.com/${REPO}/${CONFIG.branch}/${CONFIG.data}/${this.filePath}`
    if (process.env.NODE_ENV !== 'production') {
      fetchUrl = `${process.env.BASE_URL}data/${this.filePath}`
    }

    const raw = await fetch(fetchUrl)
      .then((r) => r.status === 200 ? r.text() : null)

    this.$nextTick(() => {
      this.updateMeta()
    })

    if (raw === null) {
      setTimeout(() => {
        this.removeUtterances()
      }, 100)
      this.html = `
      <span>
        Please add <code>README.md</code> to the directory as the default content for the folder.
      </span>`
      return
    } else {
      this.type = matter(raw).data.type || null
    }
    this.addUtterances()

    if (this.type !== 'reveal') {
      externalJs.onReady(() => {
        const make = new MakeHtml()
        this.html = make.make(raw!, (this.filePath.match(/\.(?:[^.]+)$/) || [])[0])
        this.$nextTick(() => {
          this.updateMeta()
          make.activate()
        })
      })
    } else {
      this.html = raw!
    }
  }

  onItemClicked (d: Dree) {
    location.href = '#' + d.relativePath
  }

  upOneLevel () {
    const m = /^(.+)\/[^/]+$/.exec(this.dree.relativePath)
    if (m) {
      location.hash = m[1]
    } else {
      location.hash = ''
    }
  }

  addUtterances () {
    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', REPO)
    script.setAttribute('issue-term', this.filePath)
    script.setAttribute('theme', 'github-light')
    script.crossOrigin = 'anonymous'
    script.async = true

    this.removeUtterances()
    const commentRef = this.$refs.comment as HTMLDivElement
    if (commentRef) {
      commentRef.append(script)
    }
  }

  removeUtterances () {
    const commentRef = this.$refs.comment as HTMLDivElement
    if (commentRef) {
      Array.from(commentRef.getElementsByTagName('script')).forEach((el) => el.remove())
      Array.from(commentRef.getElementsByClassName('utterances')).forEach((el) => el.remove())
    }
  }
}
