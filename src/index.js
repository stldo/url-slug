const COMBINING_CHARS = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF]+/g
const INVALID_SEPARATOR = /[^-._~!$&'()*+,;=]/

const CAMELCASE_PATTERN = '(?:[a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))'

const CONVERT = /[A-Za-z\d]+/g
const CONVERT_CAMELCASE = new RegExp(
  `[A-Za-z\\d]*?${CAMELCASE_PATTERN}|[A-Za-z\\d]+`,
  'g'
)

const REVERT = /[^-._~!$&'()*+,;=]+/g
const REVERT_CAMELCASE = new RegExp(
  `[^-._~!$&'()*+,;=]*?${CAMELCASE_PATTERN}|[^-._~!$&'()*+,;=]+`,
  'g'
);
const REVERT_CAMELCASE_ONLY = new RegExp(`.*?${CAMELCASE_PATTERN}|.+`, 'g')

/**
 * Validate options
 */

function validate({ camelCase, separator, transformer }, extra = {}) {
  if (camelCase !== undefined) {
    if (typeof camelCase !== 'boolean') {
      throw new Error(`camelCase must be a boolean: "${camelCase}".`)
    }
  }

  if (
    separator !== undefined &&
    !('separator' in extra && separator === extra.separator)
  ) {
    if (typeof separator !== 'string') {
      const error = 'separator' in extra ? ` or ${extra.separator}` : ''
      throw new Error(`separator must be a string${error}: "${separator}".`)
    } else if (INVALID_SEPARATOR.test(separator)) {
      const error = separator.match(INVALID_SEPARATOR)[0]
      throw new Error(`separator has an invalid character: "${error}".`)
    }
  }

  if (transformer !== undefined) {
    if (transformer !== false && typeof transformer !== 'function') {
      const error = `transformer must be false or a function: "${transformer}".`
      throw new Error(error)
    }
  }
}

/**
 * Builtin transformers
 */

export const LOWERCASE_TRANSFORMER = (fragments, separator) => {
  return fragments.join(separator).toLowerCase()
}

export const SENTENCECASE_TRANSFORMER = (fragments, separator) => {
  const sentence = fragments.join(separator)
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
}

export const TITLECASE_TRANSFORMER = (fragments, separator) => {
  return fragments.map(fragment => {
    return fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase()
  }).join(separator)
}

export const UPPERCASE_TRANSFORMER = (fragments, separator) => {
  return fragments.join(separator).toUpperCase()
}

/**
 * Converts a string into a slug
 */

export function convert(string, options = {}) {
  validate(options)

  const {
    camelCase = true,
    separator = '-',
    transformer = LOWERCASE_TRANSFORMER
  } = options

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

/**
 * Reverts a slug back to a string
 */

export function revert(slug, options = {}) {
  validate(options, { separator: null })

  const {
    camelCase = false,
    separator,
    transformer = false
  } = options

  let fragments
  slug = String(slug)

  /* Determine which method will be used split the slug */

  if ('' === separator) {
    fragments = camelCase ? slug.match(REVERT_CAMELCASE_ONLY) : [String(slug)]
  } else if ('string' === typeof separator) {
    fragments = slug.split(separator)
  } else {
    fragments = slug.match(camelCase ? REVERT_CAMELCASE : REVERT)
  }

  if (!fragments) {
    return ''
  }

  return transformer ? transformer(fragments, ' ') : fragments.join(' ')
}

/**
 * Sets convert() as the default export
 */

export default convert
