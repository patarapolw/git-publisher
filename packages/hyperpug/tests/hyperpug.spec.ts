import fs from 'fs'
import yaml from 'js-yaml'
import assert from 'assert'
import { HyperPug } from '@/hyperpug'

const testCase = yaml.safeLoad(fs.readFileSync(`${__dirname}/hyperpug.spec.yaml`, 'utf8'))
const hp = new HyperPug()

describe('HyperPug', () => {
  testCase.HyperPug.forEach((t: any) => {
    it(t.name, () => {
      assert.strictEqual(hp.parse(t.input), t.expected)
    })
  })
})
