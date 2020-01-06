import fs from 'fs'
import yaml from 'js-yaml'
import assert from 'assert'
import eqdict from '@/.'

const testCase = yaml.safeLoad(fs.readFileSync(`${__dirname}/index.spec.yaml`, 'utf8'))

describe('eqdict', () => {
  testCase.eqdict.forEach((t: any) => {
    it(t.name, () => {
      if (t.error) {
        assert.throws(() => eqdict(t.input), {
          message: t.error,
        })
      } else {
        assert.deepStrictEqual(eqdict(t.input), t.expected)
      }
    })
  })
})
