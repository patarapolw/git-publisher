const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const { scan: dreeScan } = require('dree')
const glob = require('fast-glob')

const getConfig = require('./config')

const config = getConfig(process.env.ROOT)
const dree = dreeScan(path.resolve(process.env.ROOT, config.data || './data'), {
  exclude: [
    /\.git/,
    /node_modules/,
    /\.cache/,
  ],
  extensions: ['md', 'pug'],
  excludeEmptyDirectories: true,
})

process.env.VUE_APP_CONFIG = JSON.stringify(config)
process.env.VUE_APP_ROOT = process.env.ROOT
process.env.VUE_APP_DREE = JSON.stringify(dree)
process.env.VUE_APP_PLUGINS_JS = glob.sync(config.plugins, {
  absolute: true,
  cwd: process.env.ROOT,
}).map((f) => fs.readFileSync(f, 'utf8')).join('\n')
process.env.VUE_APP_REPO = execSync('git config --get remote.origin.url', {
  cwd: process.env.ROOT,
}).toString()

// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new CopyPlugin(patterns, options),
//     ],
//   },
// }
