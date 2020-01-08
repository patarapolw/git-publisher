const path = require('path')
const fs = require('fs')

const DEFAULT_CONFIG = require('./default-config')

function deepMerge (dst, src) {
  for (const [k, v] of Object.entries(src)) {
    if (dst[k]) {
      if (Array.isArray(dst[k])) {
        dst[k] = [
          ...dst[k],
          ...(Array.isArray(v) ? v : [v]),
        ]
      } else if (typeof dst[k] === 'object') {
        deepMerge(dst[k], v)
      } else {
        dst[k] = v
      }
    } else {
      dst[k] = v
    }
  }

  return dst
}

module.exports = function getConfig (root) {
  let config = {}

  if (fs.existsSync(path.resolve(root, 'git-publisher.js'))) {
    config = require(path.resolve(root, 'git-publisher.js'))
  } else if (fs.existsSync(path.resolve(root, 'git-publisher.yaml'))) {
    config = require('js-yaml').safeLoad(fs.readFileSync(path.resolve(root, 'git-publisher.yaml'), 'utf8'))
  } else {
    const pkg = require(path.resolve(root, 'package.json'))
    config = pkg['git-publisher'] || {}
  }

  return deepMerge(DEFAULT_CONFIG, config)
}
