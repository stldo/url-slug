import { CAMELCASE_REGEXP_PATTERN } from './helpers'
import { type Transformer } from './transformers'

const REVERT = /[^-._~!$&'()*+,;=]+/g

const REVERT_CAMELCASE = new RegExp(
  "[^-._~!$&'()*+,;=]*?" + CAMELCASE_REGEXP_PATTERN + "|[^-._~!$&'()*+,;=]+",
  'g'
)

const REVERT_CAMELCASE_ONLY = new RegExp(
  '.*?' + CAMELCASE_REGEXP_PATTERN + '|.+',
  'g'
)

export interface RevertOptions {
  camelCase?: boolean
  separator?: string | null
  transformer?: Transformer | null
}

export default function revert(
  value: string,
  {
    camelCase = false,
    separator = null,
    transformer = null,
  }: RevertOptions = {}
): string {
  let fragments

  value = String(value)

  /* Determine which method will be used to split the slug */

  if (separator === '') {
    fragments = camelCase ? value.match(REVERT_CAMELCASE_ONLY) : [value]
  } else if (typeof separator === 'string') {
    fragments = value.split(separator)
  } else {
    fragments = value.match(camelCase ? REVERT_CAMELCASE : REVERT)
  }

  if (!fragments) {
    return ''
  }

  return transformer ? transformer(fragments, ' ') : fragments.join(' ')
}
