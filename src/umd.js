import convert from './convert'
import revert from './revert'
import * as transformers from './transformers'

const urlSlug = function (string, options) {
  return convert(string, options)
}

for (const transformer in transformers) {
  urlSlug[transformer] = transformers[transformer]
}

urlSlug.convert = convert
urlSlug.revert = revert

export default urlSlug
