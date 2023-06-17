import { CAMELCASE_REGEXP_PATTERN, validate } from './common'
import { replace } from './dictionary'
import { LOWERCASE_TRANSFORMER } from './transformers'

// eslint-disable-next-line no-misleading-character-class
const COMBINING_CHARS = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF]+/g

const CONVERT = /[A-Za-z\d]+/g

const CONVERT_CAMELCASE = new RegExp(
  '[A-Za-z\\d]*?' + CAMELCASE_REGEXP_PATTERN + '|[A-Za-z\\d]+',
  'g'
)

export default function (string, options) {
  options = options || {}

  if (process.env.NODE_ENV !== 'production') {
    validate(options)
  }

  const camelCase = options.camelCase !== undefined ? options.camelCase : true

  const separator = options.separator !== undefined ? options.separator : '-'

  const transformer =
    options.transformer !== undefined
      ? options.transformer
      : LOWERCASE_TRANSFORMER

  const fragments = (
    options.dictionary
      ? replace(String(string), options.dictionary)
      : String(string)
  )
    .normalize('NFKD')
    .replace(COMBINING_CHARS, '')
    .match(camelCase ? CONVERT_CAMELCASE : CONVERT)

  if (!fragments) {
    return ''
  }

  return transformer
    ? transformer(fragments, separator)
    : fragments.join(separator)
}
