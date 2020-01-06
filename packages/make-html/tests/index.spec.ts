import glob from 'fast-glob'
import fs from 'fs'
import pkg from '../../../package.json'
import MakeHtml from '@/.'
import path from 'path'

const makeHtml = new MakeHtml()

describe('Parse without browser or JSDOM', () => {
  glob.sync(`${pkg['git-publisher'].dir}/**/*.*`, {
    absolute: true,
    cwd: '../..',
  }).map((el) => {
    it(el, () => {
      makeHtml.make(fs.readFileSync(el, 'utf8'), path.extname(el))
    })
  })
})
