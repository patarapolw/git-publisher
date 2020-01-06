import fs from 'fs'
import yaml from 'js-yaml'
import assert from 'assert'
import { getIndent, eqDict } from '@/util'

const testCase = yaml.safeLoad(fs.readFileSync(`${__dirname}/util.spec.yaml`, 'utf8'))

describe('getIndent', () => {
  testCase.getIndent.forEach((t: any) => {
    it(t.name, () => {
      assert.strictEqual(getIndent(t.input), t.expected)
    })
  })
})

describe('eqDict', () => {
  testCase.eqDict.forEach((t: any) => {
    it(t.name, () => {
      assert.deepStrictEqual(eqDict(t.input), t.expected)
    })
  })
})
