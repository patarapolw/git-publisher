const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const url = require('url')

const { scan: dreeScan } = require('dree')
const glob = require('fast-glob')
const serveStatic = require('serve-static')
const escapeRegExp = require('escape-string-regexp')

const { getConfig, deepMerge } = require('./config')

process.env.ROOT = path.resolve(process.env.ROOT)

const config = getConfig(process.env.ROOT)
const dree = dreeScan(path.resolve(process.env.ROOT, 'data'), config.dree)

process.env.VUE_APP_CONFIG = JSON.stringify(config)
process.env.VUE_APP_ROOT = process.env.ROOT
process.env.VUE_APP_DREE = JSON.stringify(dree)
process.env.VUE_APP_PLUGINS_JS = glob.sync(config.plugins, {
  absolute: true,
  cwd: process.env.ROOT,
}).map((f) => fs.readFileSync(f, 'utf8')).join('\n')

const repoUrl = execSync('git config --get remote.origin.url', {
  cwd: process.env.ROOT,
}).toString()
const [_, repoAuthor, repoBase] = /([^/]+)\/([^/]+)\.git$/.exec(repoUrl.trim()) || []

process.env.VUE_APP_REPO = repoUrl
process.env.VUE_APP_TITLE = config.name || `${repoAuthor}/${repoBase}`
process.env.VUE_APP_ROUTER_MODE = config.vueRouter.mode

const baseUrl = !config.baseUrl ? `/${repoBase}/` : '/'

module.exports = deepMerge({
  publicPath: baseUrl,
  outputDir: path.resolve(process.env.ROOT, config.outputDir),
  pages: {
    index: './src/main.ts',
    reveal: './src/reveal.ts',
    404: './src/404.ts'
  },
  devServer: {
    before (app) {
      app.use(`${baseUrl}local`, serveStatic(path.resolve(process.env.ROOT, 'data')))

      app.use((req, res, next) => {
        if (req.method === 'GET') {
          const p = url.parse(req.url)

          // Set allowed extensions
          if (/(\/[^\.]+\/?|\.(html|md))$/.test(p.pathname)) {
            if (p.pathname.startsWith(baseUrl)) {
              const fixedPathname = p.pathname.substr(baseUrl.length)

              if (!['', 'index.html', 'reveal.html'].some((el) => el === fixedPathname)) {
                req.url = `${baseUrl}404.html`
                res.status(404)
              }
            }
          }
        }

        next()
      })
    },
    historyApiFallback: false,
  },
}, config.vueConfig)
