const expect = require('chai').expect
const urlSlug = require('../src/index')

describe('module', () => {
  it('includes UrlSlug constructor as a property', () => {
    expect(urlSlug.UrlSlug.constructor)
      .to.be.equal(urlSlug.constructor)
  })

  it('contains convert and revert methods', () => {
    expect(urlSlug.convert)
      .to.be.a('function')
    expect(urlSlug.revert)
      .to.be.a('function')
  })

  it('calls convert if called as a function', () => {
    expect(urlSlug)
      .to.be.equal(urlSlug.convert)
  })
})

describe('instance', () => {
  const instance = new urlSlug.UrlSlug()

  it('contains lowercase, uppercase and titlecase builtin transformers', () => {
    expect(urlSlug.transformers)
      .to.contain.all.keys('lowercase', 'uppercase', 'titlecase')
  })

  it('uses "-" as default separator', () => {
    expect(instance.separator)
      .to.be.equal('-')
    expect(instance.separator, null)
      .to.be.equal('-')
  })

  it('sets "lowercase" as default transformer', () => {
    expect(instance.transformer)
      .to.be.equal(urlSlug.transformers.lowercase)
  })

  describe('transformers', () => {
    it('contains a lowercase transformer', () => {
      expect(urlSlug.transformers.lowercase(['TEST', 'STRING'], ' '))
        .to.be.equal('test string')
    })

    it('contains an uppercase transformer', () => {
      expect(urlSlug.transformers.uppercase(['test', 'string'], ' '))
        .to.be.equal('TEST STRING')
    })

    it('contains a titlecase transformer', () => {
      expect(urlSlug.transformers.titlecase(['tesT', 'strinG'], ' '))
        .to.be.equal('Test String')
    })
  })

  describe('options', () => {
    it('does not accept a separator that is not a string', () => {
      expect(instance.convert.bind(instance, '', 123))
        .to.throw(/^The separator must be a string/)
    })

    it('accepts unreserved characters in RFC 3986 as separator', () => {
      expect(instance.convert.bind(instance, '', '-._~'))
        .to.not.throw(/^The separator has invalid characters/)
    })

    it('does not accept separators not defined as unreserved character', () => {
      expect(instance.convert.bind(instance, '', '+'))
        .to.throw(/^The separator has invalid characters/)
    })

    it('accepts false as a transformer', () => {
      expect(instance.convert.bind(instance, '', '', false))
        .to.not.throw(/^The transformer must be a function/)
    })

    it('accepts all builtin presets as a transformer', () => {
      expect(instance.convert.bind(instance, '', '', instance.lowercase))
        .to.not.throw(/^The transformer must be a function/)
      expect(instance.convert.bind(instance, '', '', instance.uppercase))
        .to.not.throw(/^The transformer must be a function/)
      expect(instance.convert.bind(instance, '', '', instance.titlecase))
        .to.not.throw(/^The transformer must be a function/)
    })

    it('accepts a function as a transformer', () => {
      expect(instance.convert.bind(instance, '', () => {}))
        .to.not.throw(/^The transformer must be a function/)
    })

    it('accepts false, a function or a builtin preset as a transformer', () => {
      expect(instance.convert.bind(instance, '', '', true))
        .to.throw(/^The transformer must be a function/)
      expect(instance.convert.bind(instance, '', '', 'nonexistent'))
        .to.throw(/^The transformer must be a function/)
      expect(instance.convert.bind(instance, '', '', {}))
        .to.throw(/^The transformer must be a function/)
    })
  })

  describe('convert', () => {
    it('converts input to string', () => {
      expect(instance.convert(123))
        .to.be.equal('123')
    })

    it('uses lowercase transformer and hyphen separator as default', () => {
      expect(instance.convert('Url Slug'))
        .to.be.equal('url-slug')
    })

    it('removes accents', () => {
      expect(instance.convert('á é í ó ú'))
        .to.be.equal('a-e-i-o-u')
    })

    it('uses upper case as transformer and use the default separator', () => {
      expect(instance.convert('a bronx tale', 'uppercase'))
        .to.be.equal('A-BRONX-TALE')
    })

    it('uses underscore as separator and title case as transformer', () => {
      expect(instance.convert('tom jobim', '_', 'titlecase'))
        .to.be.equal('Tom_Jobim')
    })

    it('allows multiple characters as separator and maintain the case', () => {
      expect(instance.convert('Charly García', '-._~-._~', false))
        .to.be.equal('Charly-._~-._~Garcia')
    })

    it('returns a camel case string', () => {
      expect(instance.convert('java script', '', 'titlecase'))
        .to.be.equal('JavaScript')
    })

    it('splits a camel case string', () => {
      expect(instance.convert('javaScript'))
        .to.be.equal('java-script')
    })

    it('returns only consonants', () => {
      const transform = (fragments, separator) => fragments
        .join(separator)
        .replace(/[aeiou]/gi, '')
      expect(instance.convert('React', '', transform))
        .to.be.equal('Rct')
    })

    it('handles empty strings', () => {
      expect(instance.convert(''))
        .to.be.equal('')
    })

    it('handles strings with no alphanumeric characters', () => {
      expect(instance.convert('- ( ) [ ]'))
        .to.be.equal('')
    })
  })

  describe('revert', () => {
    it('converts input to string', () => {
      expect(instance.revert(123))
        .to.be.equal('123')
    })

    it('uses unknown reversion and maintain input case', () => {
      expect(instance.revert('UrlSlug-_url.~slug'))
        .to.be.equal('Url Slug url slug')
    })

    it('splits on camel case and convert input to upper case', () => {
      expect(instance.revert('ClaudioBaglioni_is-Italian', '', 'uppercase'))
        .to.be.equal('CLAUDIO BAGLIONI_IS-ITALIAN')
    })

    it('returns the title of a Pink Floyd track', () => {
      expect(instance.revert('comfortably-._~numb', '-._~', 'titlecase'))
        .to.be.equal('Comfortably Numb')
    })

    it('reverts an empty string to another empty string', () => {
      expect(instance.revert(''))
        .to.be.equal('')
    })
  })
})
