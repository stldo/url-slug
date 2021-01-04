import convert from '../convert'
import { UPPERCASE_TRANSFORMER, TITLECASE_TRANSFORMER } from '../transformers'

test('accepts only boolean values in camelCase option', () => {
  expect(() => convert('', { camelCase: true }))
    .not.toThrow()
  expect(() => convert('', { camelCase: false }))
    .not.toThrow()
  expect(() => convert('', { camelCase: null }))
    .toThrow('camelCase must be a boolean')
})

test('accepts an empty string as separator', () => {
  expect(() => convert('', { separator: '' }))
    .not.toThrow()
})

test('allows only accepted separator characters', () => {
  expect(() => convert('', { separator: '-._~!$&\'()*+,;=' }))
    .not.toThrow()
  expect(() => convert('', { separator: 'x' }))
    .toThrow('separator has an invalid character')
})

test('does not accept a separator that is not a string', () => {
  expect(() => convert('', { separator: 123 }))
    .toThrow('separator must be a string')
})

test('accepts false as a transformer', () => {
  expect(() => convert('', { transformer: false }))
    .not.toThrow()
})

test('accepts a function as a transformer', () => {
  expect(() => convert('', { transformer: () => {} }))
    .not.toThrow()
})

test('accepts only false or a function as a transformer', () => {
  expect(() => convert('', { transformer: true }))
    .toThrow('transformer must be false or a function')
  expect(() => convert('', { transformer: 'string' }))
    .toThrow('transformer must be false or a function')
  expect(() => convert('', { transformer: {} }))
    .toThrow('transformer must be false or a function')
})

test('casts input to string', () => {
  expect(convert(123))
    .toBe('123')
})

test('uses lowercase transformer and hyphen separator as default', () => {
  expect(convert('Url Slug'))
    .toBe('url-slug')
})

test('removes accents', () => {
  expect(convert('á é í ó ú ç áéíóúç'))
    .toBe('a-e-i-o-u-c-aeiouc')
})

test('uses uppercase transformer and the default separator', () => {
  const options = { transformer: UPPERCASE_TRANSFORMER }

  expect(convert('a bronx tale', options))
    .toBe('A-BRONX-TALE')
})

test('uses uppercase transformer and underscore as separator', () => {
  const options = {
    separator: '_',
    transformer: TITLECASE_TRANSFORMER
  }

  expect(convert('tom jobim', options))
    .toBe('Tom_Jobim')
})

test('uses multiple characters as separator and maintains the case', () => {
  const options = { separator: '-._~-._~', transformer: false }

  expect(convert('Charly García', options))
    .toBe('Charly-._~-._~Garcia')
})

test('returns a camel case slug', () => {
  const options = {
    separator: '',
    transformer: TITLECASE_TRANSFORMER
  }

  expect(convert('java script', options))
    .toBe('JavaScript')
})

test('splits a camel case string', () => {
  const options = { transformer: false }

  expect(convert('javaScript'))
    .toBe('java-script')
  expect(convert('javaSCRIPT', options))
    .toBe('java-SCRIPT')
  expect(convert('JAVAScript', options))
    .toBe('JAVA-Script')
  expect(convert('jaVAScriPT', options))
    .toBe('ja-VA-Scri-PT')
  expect(convert('JaVaScriPt', options))
    .toBe('Ja-Va-Scri-Pt')
  expect(convert('JaVaScrIpT', options))
    .toBe('Ja-Va-Scr-Ip-T')
})

test('does not split a camel case string', () => {
  expect(convert('javaScript', { camelCase: false }))
    .toBe('javascript')
})

test('returns only consonants', () => {
  const options = {
    separator: '',
    transformer: (fragments, separator) => fragments
      .join(separator)
      .replace(/[aeiou]/gi, '')
  }

  expect(convert('React', options))
    .toBe('Rct')
})

test('handles empty strings', () => {
  expect(convert(''))
    .toBe('')
})

test('handles strings with no alphanumeric characters', () => {
  expect(convert('- ( ) [ ]'))
    .toBe('')
})

test('replaces characters set in dictionary', () => {
  const options = {
    dictionary: { '¼': 0.25, '½': ' 1/2 ', ß: 'ss', Œ: 'OE' }
  }

  expect(convert('aßcŒ', options))
    .toBe('assc-oe')
  expect(convert('¼½1', options))
    .toBe('0-25-1-2-1')
})
