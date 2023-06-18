import revert from '../revert'
import { UPPERCASE_TRANSFORMER, TITLECASE_TRANSFORMER } from '../transformers'

it('casts input to string', () => {
  expect(revert(123 as any)).toBe('123')
})

it('uses unknown reversion and does not change input case', () => {
  expect(revert('UrlSlug-_url.~slug')).toBe('UrlSlug url slug')
})

it('splits a camel case slug', () => {
  const options = { camelCase: true }

  expect(revert('javaScript', options)).toBe('java Script')
  expect(revert('javaSCRIPT', options)).toBe('java SCRIPT')
  expect(revert('JAVAScript', options)).toBe('JAVA Script')
  expect(revert('jaVAScriPT', options)).toBe('ja VA Scri PT')
  expect(revert('JaVaScriPt', options)).toBe('Ja Va Scri Pt')
  expect(revert('JaVaScrIpT', options)).toBe('Ja Va Scr Ip T')
})

it('does not split a camel case slug', () => {
  expect(revert('javaScript-language')).toBe('javaScript language')
})

it('splits on camel case and convert input to upper case', () => {
  const options = {
    camelCase: true,
    separator: '',
    transformer: UPPERCASE_TRANSFORMER,
  }

  expect(revert('ClaudioBaglioni_is-NOT-German', options)).toBe(
    'CLAUDIO BAGLIONI_IS-NOT-GERMAN'
  )
})

it('returns the title of a Pink Floyd track', () => {
  const options = {
    separator: "-._~!$&'()*+,;=",
    transformer: TITLECASE_TRANSFORMER,
  }

  expect(revert("comfortably-._~!$&'()*+,;=numb", options)).toBe(
    'Comfortably Numb'
  )
})

it('reverts an empty string to another empty string', () => {
  expect(revert('')).toBe('')
})
