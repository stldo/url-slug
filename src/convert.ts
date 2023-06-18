import { CAMELCASE_REGEXP_PATTERN, type Dictionary, replace } from './helpers'
import { LOWERCASE_TRANSFORMER, type Transformer } from './transformers'

// eslint-disable-next-line no-misleading-character-class
const COMBINING_CHARS = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF]+/g

const CONVERT = /[A-Za-z\d]+/g

const CONVERT_CAMELCASE = new RegExp(
  '[A-Za-z\\d]*?' + CAMELCASE_REGEXP_PATTERN + '|[A-Za-z\\d]+',
  'g'
)

export interface ConvertOptions {
  camelCase?: boolean
  dictionary?: Dictionary
  separator?: string
  transformer?: Transformer | null
}

export default function convert(
  value: string,
  {
    camelCase = true,
    dictionary,
    separator = '-',
    transformer = LOWERCASE_TRANSFORMER,
  }: ConvertOptions = {}
): string {
  const fragments = (
    dictionary ? replace(String(value), dictionary) : String(value)
  )
    .normalize('NFKD')
    .replace(COMBINING_CHARS, '')
    .match(camelCase ? CONVERT_CAMELCASE : CONVERT)

  if (!fragments) {
    return ''
  }

  return transformer
    ? transformer(fragments, String(separator))
    : fragments.join(String(separator))
}
