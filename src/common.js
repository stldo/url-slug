const INVALID_SEPARATOR = /[^-._~!$&'()*+,;=]/

export const CAMELCASE_REGEXP_PATTERN = '(?:[a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))'

export function validate (options, extra) {
  const camelCase = options.camelCase

  if (camelCase !== undefined && typeof camelCase !== 'boolean') {
    throw new Error('camelCase must be a boolean: "' + camelCase + '".')
  }

  const separator = options.separator
  extra = extra || {}

  if (
    separator !== undefined &&
    !('separator' in extra && separator === extra.separator)
  ) {
    if (typeof separator !== 'string') {
      throw new Error(
        'separator must be a string' +
        ('separator' in extra ? ' or ' + extra.separator : '') + ': "' +
        separator + '".'
      )
    } else if (INVALID_SEPARATOR.test(separator)) {
      throw new Error(
        'separator has an invalid character: "' +
        separator.match(INVALID_SEPARATOR)[0] + '".'
      )
    }
  }

  const transformer = options.transformer

  if (
    transformer !== undefined &&
    transformer !== false &&
    typeof transformer !== 'function'
  ) {
    throw new Error(
      'transformer must be false or a function: "' +
      transformer + '".'
    )
  }
}
