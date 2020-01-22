import { Vue, Component, Watch } from 'vue-property-decorator'
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
  disqus = CONFIG.disqus

  updateMeta () {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return
    
        if (mutation.target instanceof HTMLElement && mutation.target.querySelector('main')) {
          const title = `${
            this.currentPath === '.'
              ? './'
              : `./${this.currentPath}`
          } - ${process.env.VUE_APP_TITLE}`
          const description = this.description
      
          document.getElementsByTagName('title')[0].innerText = title;
          (document.querySelector('[property="og:title"]') as any).content = title;
          (document.querySelector('[property="twitter:title"]') as any).content = title;
      
          (document.querySelector('[name="description"]') as any).content = description;
          (document.querySelector('[property="og:description"]') as any).content = description;
          (document.querySelector('[property="twitter:description"]') as any).content = description

          observer.disconnect()
        }
      })
    })
    
    this.$nextTick(() => {
      observer.observe(this.$el, { childList: true, subtree: true })
    })
  }

  get description () {
    const div = this.$el.querySelector('main')
    if (div) {
      return div.innerText.substr(0, 140)
    }
    return ''
  }

  get relativePathHtml () {
    if (this.folderPath === '.') {
      return h('a', { href: this.$router.resolve('/data').href }, '.').outerHTML
    } else {
      const pathArray = [
        h('a', { href: this.$router.resolve('/data').href }, '.'),
        ...this.folderPath.split('/').map((p) => h('a', { href: this.$router.resolve(`/data/${p}`).href }, p)),
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
    this.updatePath()
  }

  @Watch('$route.path')
  async updatePath () {
    this.type = null
    this.html = ''

    this.currentPath = this.$route.path
      .replace(/index\.html$/, '')
      .replace(/^\/data/, '')
      .replace(/^\//, '') || '.'

    this.updateMeta()

    let d = deepfind(DREE, {
      relativePath: this.currentPath,
    })[0] as Dree

    if (!d) {
      this.insertEmptyHtml()
      return
    }

    if (d.type !== 'directory') {
      this.filePath = this.currentPath
      this.folderPath = this.currentPath.replace(/(?:\/)?[^/]+$/, '') || '.'
      d = deepfind(DREE, {
        relativePath: this.folderPath,
      })[0] as Dree
    } else {
      this.filePath = './README.md'
      this.folderPath = this.currentPath
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

  insertEmptyHtml() {
    this.html = `
      <main>
        Please add <code>README.md</code> to the directory as the default content for the folder.
      </main>`
  }

  async updateFilePath () {
    let fetchUrl = `https://raw.githubusercontent.com/${REPO}/${CONFIG.branch}/data/${this.filePath}`
    if (process.env.NODE_ENV !== 'production') {
      fetchUrl = `${process.env.BASE_URL}local/${this.filePath}`
    }

    const raw = await fetch(fetchUrl)
      .then((r) => {
        if (r.status === 200) {
          return r.text()
        }
        this.insertEmptyHtml()
        return null
      })

    if (raw === null) {
      setTimeout(() => {
        this.removeUtterances()
      }, 100)
      
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
    this.$router.push(`/data/${d.relativePath}`)
  }

  upOneLevel () {
    const m = /^(.+)\/[^/]+$/.exec(this.dree.relativePath)
    if (m) {
      this.$router.push(`/data/${m[1]}`)
    } else {
      this.$router.push('/data')
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
