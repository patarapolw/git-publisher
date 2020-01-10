// eslint-disable-next-line import/default
import dotProp from 'dot-prop'

class ExternalJsLoader {
  isLoaded = false
  isReady = false
  queue: Array<() => void> = []

  onReady (cb: () => void) {
    if (this.isLoaded) {
      cb()
    } else {
      this.queue.push(cb)
    }
  }

  load () {
    dotProp.set(window, 'gitPublisher.externalJs', this)

    if (!this.isLoaded) {
      document.body.append(Object.assign(document.createElement('script'), {
        className: 'git-publisher-plugins',
        innerHTML: process.env.VUE_APP_PLUGINS_JS + `
        window.gitPublisher.externalJs.isReady = true
        window.gitPublisher.externalJs.queue.map((cb) => cb())`,
      }))

      this.isLoaded = true
    }
  }
}

export const externalJs = new ExternalJsLoader()
externalJs.load()

export const GIT_URL: string = process.env.VUE_APP_REPO || ''
export const REPO = /([^/]+\/[^/]+)\.git/.exec(GIT_URL)![1] as string
export const CONFIG: any = JSON.parse(process.env.VUE_APP_CONFIG)
export const ROOT: string = process.env.VUE_APP_ROOT || ''
export const DREE: any = JSON.parse(process.env.VUE_APP_DREE)
