import revert from '../revert'
import { UPPERCASE_TRANSFORMER, TITLECASE_TRANSFORMER } from '../transformers'

it('accepts only boolean values in camelCase option', () => {
  expect(() => revert('', { camelCase: true }))
    .not.toThrow()
  expect(() => revert('', { camelCase: false }))
    .not.toThrow()
  expect(() => revert('', { camelCase: null }))
    .toThrow('camelCase must be a boolean')
})

it('accepts an empty string as separator', () => {
  expect(() => revert('', { separator: '' }))
    .not.toThrow()
})

it('accepts null as separator', () => {
  expect(() => revert('', { separator: null }))
    .not.toThrow()
})

it('allows only accepted separator characters', () => {
  expect(() => revert('', { separator: '-._~!$&\'()*+,;=' }))
    .not.toThrow()
  expect(() => revert('', { separator: 'x' }))
    .toThrow('separator has an invalid character')
})

it('does not accept a separator that is not a string', () => {
  expect(() => revert('', { separator: 123 }))
    .toThrow('separator must be a string or null')
})

it('accepts false as a transformer', () => {
  expect(() => revert('', { transformer: false }))
    .not.toThrow()
})

it('accepts a function as a transformer', () => {
  expect(() => revert('', { transformer: () => {} }))
    .not.toThrow()
})

it('accepts only false or a function as a transformer', () => {
  expect(() => revert('', { transformer: true }))
    .toThrow('transformer must be false or a function')
  expect(() => revert('', { transformer: 'string' }))
    .toThrow('transformer must be false or a function')
  expect(() => revert('', { transformer: {} }))
    .toThrow('transformer must be false or a function')
})

it('casts input to string', () => {
  expect(revert(123))
    .toBe('123')
})

it('uses unknown reversion and does not change input case', () => {
  expect(revert('UrlSlug-_url.~slug'))
    .toBe('UrlSlug url slug')
})

it('splits a camel case slug', () => {
  const options = { camelCase: true }

  expect(revert('javaScript', options))
    .toBe('java Script')
  expect(revert('javaSCRIPT', options))
    .toBe('java SCRIPT')
  expect(revert('JAVAScript', options))
    .toBe('JAVA Script')
  expect(revert('jaVAScriPT', options))
    .toBe('ja VA Scri PT')
  expect(revert('JaVaScriPt', options))
    .toBe('Ja Va Scri Pt')
  expect(revert('JaVaScrIpT', options))
    .toBe('Ja Va Scr Ip T')
})

it('does not split a camel case slug', () => {
  expect(revert('javaScript-language'))
    .toBe('javaScript language')
})

it('splits on camel case and convert input to upper case', () => {
  const options = {
    camelCase: true,
    separator: '',
    transformer: UPPERCASE_TRANSFORMER
  }

  expect(revert('ClaudioBaglioni_is-NOT-German', options))
    .toBe('CLAUDIO BAGLIONI_IS-NOT-GERMAN')
})

it('returns the title of a Pink Floyd track', () => {
  const options = {
    separator: '-._~!$&\'()*+,;=',
    transformer: TITLECASE_TRANSFORMER
  }

  expect(revert('comfortably-._~!$&\'()*+,;=numb', options))
    .toBe('Comfortably Numb')
})

it('reverts an empty string to another empty string', () => {
  expect(revert(''))
    .toBe('')
})
