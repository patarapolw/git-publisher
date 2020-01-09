<template lang="pug">
.container(style="margin-top: 1em")
  .columns
    .column.is-3
      b-menu
        b-menu-list(:label="'Directory: ' + relPath")
          b-menu-item(
            v-if="dree.relativePath !== '.'"
            label="..",
            @click="upOneLevel"
          )
          b-menu-item(
            tag="a"
            v-for="d in dree.children || []"
            :label="d.name"
            :key="d.name"
            :active="d.active"
            @click="onItemClicked(d)"
          )
        b-menu-list(label="About")
          b-menu-item(icon="github-circle" label="GitHub" v-if="githubUrl" tag="a" :href="githubUrl")
    .column
      .card
        .card-content.content(v-html="data")
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { REPO, DREE, CONFIG } from './global'
import { Dree } from 'dree'
import deepfind from '@patarapolw/deepfind'
import MakeHtml from './make-html'

@Component
export default class App extends Vue {
  githubUrl = `https://github.com/${REPO}`
  dree: Dree = DREE
  currentPath = '.'
  filePath = 'README.md'
  folderPath = '.'
  data = ''

  get relPath() {
    return this.folderPath === '.' ? '.' : `./${this.folderPath}`
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
    // this.removeUtterances()

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

    this.$nextTick(() => {
      this.updateFilePath()
    });

    (this.dree.children || [])
      .filter((el: any) => el.relativePath === this.filePath)
      .map((el: any) => { el.active = true })
    
    this.$set(this, 'dree', d)
  }

  async updateFilePath() {
    if (this.dree.relativePath === '.') {
      this.filePath = this.filePath.startsWith('./') ? this.filePath.substr(2) : this.filePath
    } else {
      this.filePath = this.filePath.startsWith('./') ? `${this.dree.relativePath}/${this.filePath.substr(2)}` : this.filePath
    }

    document.getElementsByTagName('title')[0].innerText = `${process.env.VUE_APP_TITLE}: ${this.filePath}`
    
    const fetchUrl = `${process.env.BASE_URL}data/${this.filePath}`
    console.log(fetchUrl)
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
    }
    this.addUtterances()

    const make = new MakeHtml()
    this.data = make.make(raw!, (this.filePath.match(/\.(?:[^.]+)$/) || [])[0])
    this.$nextTick(() => {
      make.activate()
    })
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
    this.removeUtterances()

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', REPO)
    script.setAttribute('issue-term', this.filePath)
    script.setAttribute('theme', 'github-light')
    script.crossOrigin = 'anonymous'
    script.async = true

    document.body.append(script)
  }

  removeUtterances() {
    Array.from(document.querySelectorAll('script[src="https://utteranc.es/client.js"]')).forEach((el) => el.remove())
    Array.from(document.getElementsByClassName('utterances')).forEach((el) => el.remove())
  }
}
</script>

<style lang="scss">
html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
