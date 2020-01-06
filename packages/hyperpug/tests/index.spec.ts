import fs from 'fs'
import yaml from 'js-yaml'
import assert from 'assert'
import HyperPug from '@/.'

const testCase = yaml.safeLoad(fs.readFileSync(`${__dirname}/index.spec.yaml`, 'utf8'))
const hp = new HyperPug()

describe('HyperPug', () => {
  testCase.HyperPug.forEach((t: any) => {
    it(t.name, () => {
      assert.strictEqual(hp.parse(t.input), t.expected)
    })
  })
})
