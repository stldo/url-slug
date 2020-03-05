const COMBINING_CHARS = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF]+/g
const INVALID_SEPARATOR = /[^-._~]/

const CONVERT = /[A-Za-z\d]+/g
const REVERT = /[^-._~]+/g

const CCASE = '(?:[a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))'
const CONVERT_CAMELCASE = new RegExp(`[A-Za-z0-9]*?${CCASE}|[A-Za-z0-9]+`, 'g')
const REVERT_CAMELCASE = new RegExp(`[^-._~]*?${CCASE}|[^-._~]+`, 'g')
const REVERT_CAMELCASE_WITH_EMPTY_SEPARATOR = new RegExp(`.*?${CCASE}|.+`, 'g')

/* Parse options */

function parseOptions(options) {
  const result = {}

  if (options.hasOwnProperty('camelCase')) {
    const value = options.camelCase

    if (typeof value !== 'boolean') {
      throw new Error(`camelCase must be a boolean: "${value}".`)
    }

    result.camelCase = value
  }

  if (options.hasOwnProperty('separator')) {
    const value = options.separator

    if (typeof value !== 'string') {
      throw new Error(`separator must be a string: "${value}".`)
    } else if (INVALID_SEPARATOR.test(value)) {
      const error = value.match(INVALID_SEPARATOR)[0]
      throw new Error(`separator has an invalid character: "${error}".`)
    }

    result.separator = value
  }

  if (options.hasOwnProperty('transformer')) {
    const value = options.transformer

    if (value !== false && typeof value !== 'function') {
      throw new Error(`transformer must be false or a function: "${value}".`)
    }

    result.transformer = value
  }

  return result
}

/* Builtin transformers */

export const LOWERCASE_TRANSFORMER = (fragments, separator) => {
  return fragments.join(separator).toLowerCase()
}

export const TITLECASE_TRANSFORMER = (fragments, separator) => {
  return fragments.map(fragment => {
    return fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase()
  }).join(separator)
}

export const UPPERCASE_TRANSFORMER = (fragments, separator) => {
  return fragments.join(separator).toUpperCase()
}

/* Converts a string into a slug */

export function convert(string, options = {}) {
  const {
    camelCase = true,
    separator = '-',
    transformer = LOWERCASE_TRANSFORMER,
  } = parseOptions(options)

  const fragments = String(string)
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

/* Reverts a slug back to a string */

export function revert(slug, options = {}) {
  const {
    camelCase = false,
    separator,
    transformer = false
  } = parseOptions(options)

  let fragments

  /* Determine which method will be used split the slug */

  if ('' === separator) {
    fragments = camelCase
      ? String(slug).match(REVERT_CAMELCASE_WITH_EMPTY_SEPARATOR)
      : [String(slug)]
  } else if ('string' === typeof separator) {
    fragments = String(slug).split(separator)
  } else {
    fragments = String(slug).match(camelCase ? REVERT_CAMELCASE : REVERT)
  }

  if (!fragments) {
    return ''
  }

  return transformer ? transformer(fragments, ' ') : fragments.join(' ')
}

/* Sets convert() as the default export */

export default convert
