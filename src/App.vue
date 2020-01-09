<template lang="pug">
.container(style="margin-top: 1em")
  .columns
    .column.is-3
      b-menu
        b-menu-list(:label="'Directory: ' + (dree.relativePath === '.' ? '.' : `./${dree.relativePath}`)")
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
  data = ''

  created() {
    this.currentPath = location.hash.replace(/^#/, '')
    window.addEventListener('hashchange', () => {
      this.currentPath = location.hash.replace(/^#/, '')
    })
    this.updatePath()
  }

  @Watch('currentPath')
  updatePath() {
    Array.from(document.querySelectorAll('script[src="https://utteranc.es/client.js"]')).forEach((el) => el.remove())
    Array.from(document.getElementsByClassName('utterances')).forEach((el) => el.remove())

    let mFileRegex = /^(?:(.+)\/[^/]+)\.[^/]+$/.exec(this.currentPath)

    if (mFileRegex) {
      this.filePath = this.currentPath
      this.currentPath = mFileRegex[1]
    }

    const d = deepfind(DREE, {
      relativePath: this.currentPath
    })[0] as any

    (this.dree.children || [])
      .filter((el: any) => el.relativePath === this.filePath)
      .map((el: any) => { el.active = true })
    
    this.$set(this, 'dree', d)

    console.log(mFileRegex)

    if (mFileRegex) {
      document.getElementsByTagName('title')[0].innerText = `${process.env.VUE_APP_TITLE}: ./${this.filePath}`
    } else {
      document.getElementsByTagName('title')[0].innerText = `${process.env.VUE_APP_TITLE}: ./${this.dree.relativePath}`
      this.data = `
      <span>
        Please add <code>README.md</code> to the directory as the default content for the folder.
      </span>`
    }
  }

  @Watch('filePath')
  async updateFilePath() {
    this.filePath = this.filePath.includes('/') ? this.filePath : `${this.dree.relativePath}/${this.filePath}`
    const raw = await fetch(`https://raw.githubusercontent.com/${REPO}/${CONFIG.branch}/${CONFIG.data}/${this.filePath}`)
      .then((r) => r.status === 200 ? r.text() : '')

    const make = new MakeHtml()
    this.data = make.make(raw, (this.filePath.match(/\.(?:[^.]+)$/) || [])[0])
    this.$nextTick(() => {
      make.activate()
    })

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', REPO)
    script.setAttribute('issue-term', this.filePath)
    script.setAttribute('theme', 'github-light')
    script.crossOrigin = 'anonymous'
    script.async = true

    document.body.append(script)
  }

  onItemClicked(d: Dree) {
    location.href = '#' + d.relativePath
  }

  upOneLevel() {
    const m = /^(.+)\/[^/]+$/.exec(this.dree.relativePath)
    if (m) {
      location.hash = m[1]
    } else {
      location.hash = '.'
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
