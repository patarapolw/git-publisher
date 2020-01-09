export const externalJs = {
  isLoaded: false,
  isReady: false,
}

if (!externalJs.isLoaded) {
  document.body.append(Object.assign(document.createElement('script'), {
    className: 'git-publisher-plugins',
    innerHTML: process.env.VUE_APP_PLUGINS_JS,
    onload: () => { externalJs.isReady = true },
  }))

  externalJs.isLoaded = true
}

export const GIT_URL: string = process.env.VUE_APP_REPO || ''
export const REPO = /([^/]+\/[^/]+)\.git/.exec(GIT_URL)![1] as string
export const CONFIG: any = JSON.parse(process.env.VUE_APP_CONFIG)
export const ROOT: string = process.env.VUE_APP_ROOT || ''
export const DREE: any = JSON.parse(process.env.VUE_APP_DREE)
