import HyperPug from 'hyperpug'

import { pugExt } from './ext'

let hp: HyperPug | undefined

export function pugConvert (s: string) {
  if (!hp) {
    hp = new HyperPug(pugExt)
  }

  return hp.parse(s)
}
