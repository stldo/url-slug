import { expect } from 'chai'
import * as urlSlug from '../src'

describe('module', () => {
  it('sets the convert function as the default export', () => {
    expect(urlSlug.convert).to.be.equal(urlSlug.default)
  })

  it('has builtin transformers', () => {
    expect(typeof urlSlug.LOWERCASE_TRANSFORMER).to.be.equal('function')
    expect(typeof urlSlug.SENTENCECASE_TRANSFORMER).to.be.equal('function')
    expect(typeof urlSlug.TITLECASE_TRANSFORMER).to.be.equal('function')
    expect(typeof urlSlug.UPPERCASE_TRANSFORMER).to.be.equal('function')
  })

  it('has a working lowercase transformer', () => {
    const fragments = ['AA', 'BB']
    const separator = '-'
    const transformer = urlSlug.LOWERCASE_TRANSFORMER
    expect(transformer(fragments, separator)).to.be.equal('aa-bb')
  })

  it('has a working sentence case transformer', () => {
    const fragments = ['aA', 'BB']
    const separator = '-'
    const transformer = urlSlug.SENTENCECASE_TRANSFORMER
    expect(transformer(fragments, separator)).to.be.equal('Aa-bb')
  })

  it('has a working tittle case transformer', () => {
    const fragments = ['aA', 'bB']
    const separator = '-'
    const transformer = urlSlug.TITLECASE_TRANSFORMER
    expect(transformer(fragments, separator)).to.be.equal('Aa-Bb')
  })

  it('has a working uppercase transformer', () => {
    const fragments = ['aa', 'bb']
    const separator = '-'
    const transformer = urlSlug.UPPERCASE_TRANSFORMER
    expect(transformer(fragments, separator)).to.be.equal('AA-BB')
  })
})

describe('convert', () => {
  it('accepts only boolean values in camelCase option', () => {
    expect(() => urlSlug.convert('', { camelCase: true }))
      .to.not.throw()
    expect(() => urlSlug.convert('', { camelCase: false }))
      .to.not.throw()
    expect(() => urlSlug.convert('', { camelCase: null }))
      .to.throw('camelCase must be a boolean')
  })

  it('accepts an empty string as separator', () => {
    expect(() => urlSlug.convert('', { separator: '' }))
      .to.not.throw()
  })

  it('allows only accepted separator characters', () => {
    expect(() => urlSlug.convert('', { separator: '-._~!$&\'()*+,;=' }))
      .to.not.throw()
    expect(() => urlSlug.convert('', { separator: 'x' }))
      .to.throw('separator has an invalid character')
  })

  it('does not accept a separator that is not a string', () => {
    expect(() => urlSlug.convert('', { separator: 123 }))
      .to.throw('separator must be a string')
  })

  it('accepts false as a transformer', () => {
    expect(() => urlSlug.convert('', { transformer: false }))
      .to.not.throw()
  })

  it('accepts a function as a transformer', () => {
    expect(() => urlSlug.convert('', { transformer: () => {} }))
      .to.not.throw()
  })

  it('accepts only false or a function as a transformer', () => {
    expect(() => urlSlug.convert('', { transformer: true }))
      .to.throw('transformer must be false or a function')
    expect(() => urlSlug.convert('', { transformer: 'string' }))
      .to.throw('transformer must be false or a function')
    expect(() => urlSlug.convert('', { transformer: {} }))
      .to.throw('transformer must be false or a function')
  })

  it('casts input to string', () => {
    expect(urlSlug.convert(123))
      .to.be.equal('123')
  })

  it('uses lowercase transformer and hyphen separator as default', () => {
    expect(urlSlug.convert('Url Slug'))
      .to.be.equal('url-slug')
  })

  it('removes accents', () => {
    expect(urlSlug.convert('á é í ó ú ç áéíóúç'))
      .to.be.equal('a-e-i-o-u-c-aeiouc')
  })

  it('uses uppercase transformer and the default separator', () => {
    const options = { transformer: urlSlug.UPPERCASE_TRANSFORMER }
    expect(urlSlug.convert('a bronx tale', options))
      .to.be.equal('A-BRONX-TALE')
  })

  it('uses uppercase transformer and underscore as separator', () => {
    const options = {
      separator: '_',
      transformer: urlSlug.TITLECASE_TRANSFORMER,
    }
    expect(urlSlug.convert('tom jobim', options))
      .to.be.equal('Tom_Jobim')
  })

  it('uses multiple characters as separator and maintains the case', () => {
    const options = { separator: '-._~-._~', transformer: false }
    expect(urlSlug.convert('Charly García', options))
      .to.be.equal('Charly-._~-._~Garcia')
  })

  it('returns a camel case slug', () => {
    const options = {
      separator: '',
      transformer: urlSlug.TITLECASE_TRANSFORMER
    }
    expect(urlSlug.convert('java script', options))
      .to.be.equal('JavaScript')
  })

  it('splits a camel case string', () => {
    const options = { transformer: false }
    expect(urlSlug.convert('javaScript'))
      .to.be.equal('java-script')
    expect(urlSlug.convert('javaSCRIPT', options))
      .to.be.equal('java-SCRIPT')
    expect(urlSlug.convert('JAVAScript', options))
      .to.be.equal('JAVA-Script')
    expect(urlSlug.convert('jaVAScriPT', options))
      .to.be.equal('ja-VA-Scri-PT')
    expect(urlSlug.convert('JaVaScriPt', options))
      .to.be.equal('Ja-Va-Scri-Pt')
    expect(urlSlug.convert('JaVaScrIpT', options))
      .to.be.equal('Ja-Va-Scr-Ip-T')
  })

  it('does not split a camel case string', () => {
    expect(urlSlug.convert('javaScript', { camelCase: false }))
      .to.be.equal('javascript')
  })

  it('returns only consonants', () => {
    const options = {
      separator: '',
      transformer: (fragments, separator) => fragments
        .join(separator)
        .replace(/[aeiou]/gi, '')
    }
    expect(urlSlug.convert('React', options))
      .to.be.equal('Rct')
  })

  it('handles empty strings', () => {
    expect(urlSlug.convert(''))
      .to.be.equal('')
  })

  it('handles strings with no alphanumeric characters', () => {
    expect(urlSlug.convert('- ( ) [ ]'))
      .to.be.equal('')
  })

  it('replaces characters set in dictionary', () => {
    const options = {
      dictionary: { '¼': 0.25, '½': ' 1/2 ', 'ß': 'ss', 'Œ': 'OE' }
    }
    expect(urlSlug.convert('aßcŒ', options))
      .to.be.equal('assc-oe')
    expect(urlSlug.convert('¼½1', options))
      .to.be.equal('0-25-1-2-1')
  })
})

describe('revert', () => {
  it('accepts only boolean values in camelCase option', () => {
    expect(() => urlSlug.revert('', { camelCase: true }))
      .to.not.throw()
    expect(() => urlSlug.revert('', { camelCase: false }))
      .to.not.throw()
    expect(() => urlSlug.revert('', { camelCase: null }))
      .to.throw('camelCase must be a boolean')
  })

  it('accepts an empty string as separator', () => {
    expect(() => urlSlug.revert('', { separator: '' }))
      .to.not.throw()
  })

  it('accepts null as separator', () => {
    expect(() => urlSlug.revert('', { separator: null }))
      .to.not.throw()
  })

  it('allows only accepted separator characters', () => {
    expect(() => urlSlug.revert('', { separator: '-._~!$&\'()*+,;=' }))
      .to.not.throw()
    expect(() => urlSlug.revert('', { separator: 'x' }))
      .to.throw('separator has an invalid character')
  })

  it('does not accept a separator that is not a string', () => {
    expect(() => urlSlug.revert('', { separator: 123 }))
      .to.throw('separator must be a string or null')
  })

  it('accepts false as a transformer', () => {
    expect(() => urlSlug.revert('', { transformer: false }))
      .to.not.throw()
  })

  it('accepts a function as a transformer', () => {
    expect(() => urlSlug.revert('', { transformer: () => {} }))
      .to.not.throw()
  })

  it('accepts only false or a function as a transformer', () => {
    expect(() => urlSlug.revert('', { transformer: true }))
      .to.throw('transformer must be false or a function')
    expect(() => urlSlug.revert('', { transformer: 'string' }))
      .to.throw('transformer must be false or a function')
    expect(() => urlSlug.revert('', { transformer: {} }))
      .to.throw('transformer must be false or a function')
  })

  it('casts input to string', () => {
    expect(urlSlug.revert(123))
      .to.be.equal('123')
  })

  it('uses unknown reversion and does not change input case', () => {
    expect(urlSlug.revert('UrlSlug-_url.~slug'))
      .to.be.equal('UrlSlug url slug')
  })

  it('splits a camel case slug', () => {
    const options = { camelCase: true }
    expect(urlSlug.revert('javaScript', options))
      .to.be.equal('java Script')
    expect(urlSlug.revert('javaSCRIPT', options))
      .to.be.equal('java SCRIPT')
    expect(urlSlug.revert('JAVAScript', options))
      .to.be.equal('JAVA Script')
    expect(urlSlug.revert('jaVAScriPT', options))
      .to.be.equal('ja VA Scri PT')
    expect(urlSlug.revert('JaVaScriPt', options))
      .to.be.equal('Ja Va Scri Pt')
    expect(urlSlug.revert('JaVaScrIpT', options))
      .to.be.equal('Ja Va Scr Ip T')
  })

  it('does not split a camel case slug', () => {
    expect(urlSlug.revert('javaScript-language'))
      .to.be.equal('javaScript language')
  })

  it('splits on camel case and convert input to upper case', () => {
    const options = {
      camelCase: true,
      separator: '',
      transformer: urlSlug.UPPERCASE_TRANSFORMER,
    }
    expect(urlSlug.revert('ClaudioBaglioni_is-NOT-German', options))
      .to.be.equal('CLAUDIO BAGLIONI_IS-NOT-GERMAN')
  })

  it('returns the title of a Pink Floyd track', () => {
    const options = {
      separator: '-._~!$&\'()*+,;=',
      transformer: urlSlug.TITLECASE_TRANSFORMER
    }
    expect(urlSlug.revert('comfortably-._~!$&\'()*+,;=numb', options))
      .to.be.equal('Comfortably Numb')
  })

  it('reverts an empty string to another empty string', () => {
    expect(urlSlug.revert(''))
      .to.be.equal('')
  })
})
