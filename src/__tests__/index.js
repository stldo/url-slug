import * as urlSlug from '../index'

test('sets the convert function as the default export', () => {
  expect(urlSlug.convert)
    .toBe(urlSlug.default)
})

test('has builtin transformers', () => {
  expect(typeof urlSlug.LOWERCASE_TRANSFORMER)
    .toBe('function')
  expect(typeof urlSlug.SENTENCECASE_TRANSFORMER)
    .toBe('function')
  expect(typeof urlSlug.TITLECASE_TRANSFORMER)
    .toBe('function')
  expect(typeof urlSlug.UPPERCASE_TRANSFORMER)
    .toBe('function')
})

test('has a working lowercase transformer', () => {
  const fragments = ['AA', 'BB']
  const separator = '-'
  const transformer = urlSlug.LOWERCASE_TRANSFORMER

  expect(transformer(fragments, separator))
    .toBe('aa-bb')
})

test('has a working sentence case transformer', () => {
  const fragments = ['aA', 'BB']
  const separator = '-'
  const transformer = urlSlug.SENTENCECASE_TRANSFORMER

  expect(transformer(fragments, separator))
    .toBe('Aa-bb')
})

test('has a working tittle case transformer', () => {
  const fragments = ['aA', 'bB']
  const separator = '-'
  const transformer = urlSlug.TITLECASE_TRANSFORMER

  expect(transformer(fragments, separator))
    .toBe('Aa-Bb')
})

test('has a working uppercase transformer', () => {
  const fragments = ['aa', 'bb']
  const separator = '-'
  const transformer = urlSlug.UPPERCASE_TRANSFORMER

  expect(transformer(fragments, separator))
    .toBe('AA-BB')
})
