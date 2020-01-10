<template lang="pug">
.container(style="margin-top: 1em")
  .columns
    .column.is-3
      b-menu
        b-menu-list
          template(slot="label")
            span(style="margin-right: 1em") Directory:
            span(v-html="relativePathHtml")
          b-menu-item(
            v-if="dree.relativePath !== '.'"
            icon="folder-outline"
            label="..",
            @click="upOneLevel"
          )
          b-menu-item(
            tag="a"
            v-for="d in dree.children || []"
            :icon="d.type === 'directory' ? 'folder' : 'file-outline'"
            :label="d.name"
            :key="d.name"
            :active="d.active"
            @click="onItemClicked(d)"
          )
        b-menu-list(label="About")
          b-menu-item(icon="github-circle" label="GitHub" v-if="githubUrl" tag="a" :href="githubUrl")
    .column
      .card
        iframe#iframe-reveal(v-if="type === 'reveal'" :src="revealUrl" frameborder="0")
        .card-content.content(v-else v-html="data")
      div(ref="comment")
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { REPO, DREE, CONFIG } from './global'
import { Dree } from 'dree'
import deepfind from '@patarapolw/deepfind'
import MakeHtml from './make-html'
import h from 'hyperscript'
import matter from 'gray-matter'

@Component
export default class App extends Vue {
  githubUrl = `https://github.com/${REPO}`
  dree: Dree = DREE
  currentPath = '.'
  filePath = 'README.md'
  folderPath = '.'
  data = ''
  type: string | null = null

  get relativePathHtml() {
    if (this.folderPath === '.') {
      return h('a', { href: '#' }, '.').outerHTML
    } else {
      const pathArray = [
        h('a', { href: '#' }, '.'),
        ...this.folderPath.split('/').map((p) => h('a', { href: `#${p}` }, p))
      ].reduce((a, el) => {
        return [
          ...a,
          h('span','/'),
          el
        ]
      }, [] as HTMLElement[])
      pathArray.shift()

      return h('span', pathArray).outerHTML
    }
  }

  get revealUrl () {
    return `${process.env.BASE_URL}reveal.html?filePath=${encodeURIComponent(this.filePath)}`
  }

  created() {
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

  updatePath() {
    this.currentPath = decodeURIComponent(this.currentPath)

    let d = deepfind(DREE, {
      relativePath: this.currentPath || '.'
    })[0] as Dree

    if (d.type !== 'directory') {
      this.filePath = this.currentPath
      this.folderPath = this.currentPath.replace(/(?:\/)?[^/]+$/, '') || '.'
      d = deepfind(DREE, {
        relativePath: this.folderPath
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
    });
  }

  async updateFilePath() {
    document.getElementsByTagName('title')[0].innerText = `${process.env.VUE_APP_TITLE}: ${this.filePath}`
    
    let fetchUrl = `https://raw.githubusercontent.com/${REPO}/${CONFIG.branch}/${CONFIG.data}/${this.filePath}`
    if (process.env.NODE_ENV !== 'production') {
      fetchUrl = `${process.env.BASE_URL}data/${this.filePath}`
    }

    const raw = await fetch(fetchUrl)
      .then((r) => r.status === 200 ? r.text() : null)

    if (raw === null) {
      setTimeout(() => {
        this.removeUtterances()
      }, 100)
      this.data = `
      <span>
        Please add <code>README.md</code> to the directory as the default content for the folder.
      </span>`
      return
    } else {
      this.type = matter(raw).data.type || null
    }
    this.addUtterances()

    if (this.type !== 'reveal') {
      const make = new MakeHtml()
      this.data = make.make(raw!, (this.filePath.match(/\.(?:[^.]+)$/) || [])[0])
      this.$nextTick(() => {
        make.activate()
      })
    }
  }

  onItemClicked(d: Dree) {
    location.href = '#' + d.relativePath
  }

  upOneLevel() {
    const m = /^(.+)\/[^/]+$/.exec(this.dree.relativePath)
    if (m) {
      location.hash = m[1]
    } else {
      location.hash = ''
    }
  }

  addUtterances() {
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

  removeUtterances() {
    const commentRef = this.$refs.comment as HTMLDivElement
    if (commentRef) {
      Array.from(commentRef.getElementsByTagName('script')).forEach((el) => el.remove())
      Array.from(commentRef.getElementsByClassName('utterances')).forEach((el) => el.remove())
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  width: 100%;
  height: 100%;
}

#iframe-reveal {
  width: 100%;
  height: 40vw;
}

@media only screen and (max-width: 770px) {
  #iframe-reveal {
    height: 70vw;
  } 
}
</style>
