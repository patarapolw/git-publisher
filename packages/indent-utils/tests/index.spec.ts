import fs from 'fs'
import yaml from 'js-yaml'
import assert from 'assert'
import { getIndent, createIndentedFilter } from '@/.'

const testCase = yaml.safeLoad(fs.readFileSync(`${__dirname}/index.spec.yaml`, 'utf8'))

describe('getIndent', () => {
  testCase.getIndent.forEach((t: any) => {
    it(t.name, () => {
      assert.strictEqual(getIndent(t.input), t.expected)
    })
  })
})

describe('createIndentedFilter', () => {
  const indentedFilter = createIndentedFilter('name', (s, attrs) => {
    return `<!-- ${JSON.stringify(attrs)}: ${s} -->`
  })

  testCase.createIndentedFilter.forEach((t: any) => {
    it(t.name, () => {
      assert.strictEqual(indentedFilter(t.input), t.expected)
    })
  })
})
