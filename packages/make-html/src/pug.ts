import hyperpug, { IHyperPugFilters } from 'hyperpug'
import { mdConvert } from './markdown'

const pugExt: IHyperPugFilters = {
  markdown: (s) => mdConvert(s),
}

export function pugConvert (s: string) {
  return hyperpug.compile({ filters: pugExt })(s)
}
