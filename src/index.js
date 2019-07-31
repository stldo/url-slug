const unidecode = require('unidecode')

/* TODO v2.2
* - Remove support for transformers represented by strings ('uppercase', etc.)
*/

/* TODO v3
 * - Set default transformers as exports
 * - ESM with multiple exports
 * - Deprecate defaultTransformers
 * - Deprecate parseOptions, use a config object instead
 * - Deprecate null as separator
 * - Add support to NFKD normalize, make unidecode an option (full?)
 * - Browser support
 * - Add sentence case transformer
 * - Supported characters:
 *   - default: ALPHA / DIGIT / "-" / "." / "_" / "~"
 *   - path: ALPHA / DIGIT / "-" / "." / "_" / "~" / "!" / "$" / "&" /
 *           "'" / "(" / ")" / "*" / "+" / "," / ";" / "=" / "@"
 *     - ":" is non-zero-length segment without any colon, allow it?
 *   - query: ALPHA / DIGIT / "-" / "." / "_" / "~" / "!" / "$" / "'" / "(" /
 *            ")" / "*" / "+" / "," / ";" / "=" / "@" / "/" / "?"
 *     - "&" is commonly used to separate key/value pairs, allow it?
 *   - hash: ALPHA / DIGIT / "-" / "." / "_" / "~" / "!" / "$" / "&" / "'" /
 *           "(" / ")" / "*" / "+" / "," / ";" / "=" / "@" / "/" / "?"
 */

const INVALID_SEPARATOR = /[^-._~]/
// const CONVERT = /[A-Za-z\d]+/g
// const REVERT = /[^-._~]+/g

const BASE = '(?:[a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))'
const CONVERT_CAMELCASE = new RegExp(`[A-Za-z0-9]*?${BASE}|[A-Za-z0-9]+`, 'g')
const REVERT_CAMELCASE = new RegExp(`[^-._~]*?${BASE}|[^-._~]+`, 'g')
const REVERT_CAMELCASE_WITH_EMPTY_SEPARATOR = new RegExp(`.*?${BASE}|.+`, 'g')

/**
* Check and return validated options
*/
function parseOptions(options) {
  let camelCase
  let separator
  let transformer

  if (2 === options.length) {
    [separator, transformer] = options
    if (defaultTransformers[transformer]) {
      transformer = defaultTransformers[transformer] /* Don't validate */
      validate({ separator })
    } else {
      validate({ separator, transformer })
    }
  } else if (1 === options.length) {
    const option = options[0]
    if (false === option || 'function' === typeof option) {
      transformer = option /* Don't validate */
    } else if (defaultTransformers[option]) {
      transformer = defaultTransformers[option] /* Don't validate */
    } else if (option == null || typeof option === 'string') {
      separator = option
      validate({ separator })
    } else {
      camelCase = option.camelCase
      separator = option.separator
      transformer = option.transformer
      validate({ camelCase, separator, transformer })
    }
  }

  return {
    camelCase,
    separator: separator == null ? void 0 : separator,
    transformer
  }
}

/**
* Validate options
*/
function validate({ camelCase, separator, transformer }) {
  if (camelCase !== undefined) {
    if (typeof camelCase !== 'boolean') {
      throw new Error(`camelCase must be a boolean: "${camelCase}".`)
    }
  }

  if (separator != null) {
    if ('string' !== typeof separator) {
      throw new Error(`separator must be a string: "${separator}".`)
    } else if (INVALID_SEPARATOR.test(separator)) {
      throw new Error(`separator has invalid characters: "${separator}".`)
    }
  }

  if (transformer != null) {
    if (false !== transformer
      && 'function' !== typeof transformer
      && !defaultTransformers[transformer] /* TODO Deprecate */
    ) {
      throw new Error(`transformer must be a function: "${transformer}".`)
    }
  }
}

class UrlSlug {

  static LOWERCASE_TRANSFORMER(fragments, separator) {
    return fragments.join(separator).toLowerCase()
  }

  static UPPERCASE_TRANSFORMER(fragments, separator) {
    return fragments.join(separator).toUpperCase()
  }

  static TITLECASE_TRANSFORMER(fragments, separator) {
    return fragments.map(fragment => {
      return fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase()
    }).join(separator)
  }

  /**
  * Creates a new instance of url-slug
  */
  constructor(...options) {
    const {
      camelCase = true,
      separator = '-',
      transformer = UrlSlug.LOWERCASE_TRANSFORMER
    } = parseOptions(options)

    this.camelCase = camelCase
    this.separator = separator
    this.transformer = transformer
  }

  /**
  * Converts a string into a slug
  */
  convert(string, ...options) {
    const {
      separator = this.separator,
      transformer = this.transformer,
    } = parseOptions(options)

    const fragments = unidecode(String(string)).match(CONVERT_CAMELCASE)

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
  revert(slug, ...options) {
    const { separator = null, transformer = false } = parseOptions(options)

    let fragments
    slug = String(slug)

    /* Determine which method will be used split the slug */

    if ('' === separator) {
      fragments = slug.match(REVERT_CAMELCASE_WITH_EMPTY_SEPARATOR)
    } else if ('string' === typeof separator) {
      fragments = slug.split(separator)
    } else {
      fragments = slug.match(REVERT_CAMELCASE)
    }

    if (!fragments) {
      return ''
    }

    return transformer ? transformer(fragments, ' ') : fragments.join(' ')
  }

}

/**
* Builtin transformers // TODO Deprecate
*/
const defaultTransformers = {
  lowercase: UrlSlug.LOWERCASE_TRANSFORMER,
  uppercase: UrlSlug.UPPERCASE_TRANSFORMER,
  titlecase: UrlSlug.TITLECASE_TRANSFORMER,
}

/* Prepare the global instance and export it */

const urlSlug = new UrlSlug()
const global = urlSlug.convert.bind(urlSlug)

global.UrlSlug = UrlSlug
global.convert = global
global.revert = urlSlug.revert.bind(urlSlug)
global.transformers = defaultTransformers // TODO Deprecate

module.exports = global
