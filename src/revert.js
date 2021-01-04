import { CAMELCASE_REGEXP_PATTERN, validate } from './common'

const REVERT = /[^-._~!$&'()*+,;=]+/g

const REVERT_CAMELCASE = new RegExp(
  '[^-._~!$&\'()*+,;=]*?' + CAMELCASE_REGEXP_PATTERN + '|[^-._~!$&\'()*+,;=]+',
  'g'
)

const REVERT_CAMELCASE_ONLY = new RegExp(
  '.*?' + CAMELCASE_REGEXP_PATTERN + '|.+',
  'g'
)

export default function (slug, options) {
  options = options || {}

  if (process.env.NODE_ENV !== 'production') {
    validate(options, { separator: null })
  }

  const camelCase = options.camelCase !== undefined
    ? options.camelCase
    : false

  const separator = options.separator

  const transformer = options.transformer !== undefined
    ? options.transformer
    : false

  let fragments
  slug = String(slug)

  /* Determine which method will be used split the slug */

  if (separator === '') {
    fragments = camelCase ? slug.match(REVERT_CAMELCASE_ONLY) : [String(slug)]
  } else if (typeof separator === 'string') {
    fragments = slug.split(separator)
  } else {
    fragments = slug.match(camelCase ? REVERT_CAMELCASE : REVERT)
  }

  if (!fragments) {
    return ''
  }

  return transformer ? transformer(fragments, ' ') : fragments.join(' ')
}
