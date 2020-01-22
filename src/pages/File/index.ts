import { Vue, Component, Watch } from 'vue-property-decorator'
import { Dree } from 'dree'
import deepfind from '@patarapolw/deepfind'
import h from 'hyperscript'
import matter from 'gray-matter'

import { REPO, DREE, CONFIG, externalJs } from '@/global'
import MakeHtml from '@/make-html'
import { setMeta } from '@/utils/meta'

@Component
export default class App extends Vue {
  githubUrl = `https://github.com/${REPO}`
  dree: Dree = DREE
  currentPath = '.'
  filePath = 'README.md'
  folderPath = '.'
  
  rawHtml = ''
  rawHtmlStatus = 200

  type: string | null = null
  disqus = CONFIG.disqus

  get html () {
    if (this.rawHtmlStatus === 200) {
      return this.rawHtml
    } else {
      return `
      <main>
        Please add <code>README.md</code> to the directory as the default content for the folder.
      </main>`
    }
  }

  setHtml (s: string | null, status?: number) {
    if (s !== null) {
      this.rawHtml = s
    }
    this.rawHtmlStatus = status || 200
  }

  async updateMeta () {
    const doUpdateMeta = () => {
      const title = `${
        this.currentPath === '.'
          ? './'
          : `./${this.currentPath}`
      } - ${process.env.VUE_APP_TITLE}`

      const description = (() => {
        const main = this.$el.querySelector('main')

        if (main) {
          return main.innerText.substr(0, 140)
        }

        return ''
      })()

      setMeta({ tagName: 'title', content: title })
      setMeta({ property: 'og:title', content: title })
      setMeta({ property: 'twitter:title', content: title })

      setMeta({ name: 'description', content: description })
      setMeta({ property: 'og:description', content: description })
      setMeta({ property: 'twitter:description', content: description })
    }

    while (!this.rawHtmlStatus || !this.$el.getElementsByTagName('main')[0]) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    doUpdateMeta()
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

  mounted () {
    this.updatePath()
  }

  @Watch('$route.path')
  async updatePath () {
    this.type = null
    this.rawHtmlStatus = 0

    this.currentPath = this.$route.path
      .replace(/index\.html$/, '')
      .replace(/^\/data/, '')
      .replace(/^\//, '') || '.'

    let d = deepfind(DREE, {
      relativePath: this.currentPath,
    })[0] as Dree

    if (!d) {
      this.$router.push({ name: '404' })
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

  async updateFilePath () {
    let fetchUrl = `https://raw.githubusercontent.com/${REPO}/${CONFIG.branch}/data/${this.filePath}`
    if (process.env.NODE_ENV !== 'production') {
      fetchUrl = `${process.env.BASE_URL}local/${this.filePath}`
    }

    const raw = await fetch(fetchUrl)
      .then((r) => {
        this.rawHtmlStatus = r.status

        if (r.status === 200) {
          return r.text()
        }
        
        if (fetchUrl.endsWith('/README.md')) {
          this.updateMeta()
        } else {
          this.$router.push({ name: '404', path: this.$route.path })
        }

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
        this.rawHtml = make.make(raw!, (this.filePath.match(/\.(?:[^.]+)$/) || [])[0])
        this.updateMeta()

        this.$nextTick(() => {
          make.activate()
        })
      })
    } else {
      this.rawHtml = raw!
      this.updateMeta()
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
