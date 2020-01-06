import glob from 'fast-glob'
import fs from 'fs'
import pkg from '../../../package.json'
import MakeHtml from '../src'

const makeHtml = new MakeHtml()

describe('Parse with browser or JSDOM', () => {
  glob.sync(`${pkg['git-publisher'].dir}/**/*.*`, {
    absolute: true,
    cwd: '../..',
  }).map((el) => {
    it(el, () => {
      makeHtml.make(fs.readFileSync(el, 'utf8'))
    })
  })
})
