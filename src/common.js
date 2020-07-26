const INVALID_SEPARATOR = /[^-._~!$&'()*+,;=]/

export const CAMELCASE_REGEXP_PATTERN = '(?:[a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))'

export function validate({ camelCase, separator, transformer }, extra = {}) {
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
