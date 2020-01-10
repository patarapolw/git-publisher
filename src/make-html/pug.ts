import HyperPug from 'hyperpug'

import getExtensions from './ext'

let hp: HyperPug | undefined

export function pugConvert (s: string) {
  if (!hp) {
    hp = new HyperPug(getExtensions().pug)
  }

  return hp.parse(s)
}
