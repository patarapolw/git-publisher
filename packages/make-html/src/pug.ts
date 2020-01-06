import HyperPug, { IHyperPugFilters } from 'hyperpug'
import { mdConvert } from './markdown'

let hp: HyperPug | undefined

const pugExt: IHyperPugFilters = {
  markdown: (s: string) => mdConvert(s),
}

export function pugConvert (s: string) {
  if (!hp) {
    hp = new HyperPug(pugExt)
  }

  return hp.parse(s)
}
