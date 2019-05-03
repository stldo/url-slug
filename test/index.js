const expect = require('chai').expect
const urlSlug = require('../src/index')

describe('module', () => {

  it('should include constructor as a property', () => {
    expect(urlSlug.UrlSlug.constructor)
      .to.be.equal(urlSlug.constructor)
  })

  it('should contain convert and revert methods', () => {
    expect(urlSlug.convert)
      .to.be.a('function')
    expect(urlSlug.revert)
      .to.be.a('function')
  })

  it('should call convert if called as a function', () => {
    expect(urlSlug)
      .to.be.equal(urlSlug.convert)
  })

  describe('instance', () => {

    const instance = new urlSlug.UrlSlug()

    it(
      'should contain lowercase, uppercase and titlecase builtin transformers',
      () => {
        expect(urlSlug.transformers)
          .to.contain.all.keys('lowercase', 'uppercase', 'titlecase')
      }
    )

    it('should set "-" as default separator', () => {
      expect(instance.separator)
        .to.be.equal('-')
    })

    it('should set "lowercase" as default transformer', () => {
      expect(instance.transformer)
        .to.be.equal(urlSlug.transformers.lowercase)
    })

    describe('transformers', () => {

      it('should contain a working lowercase', () => {
        expect(urlSlug.transformers.lowercase(['TEST', 'STRING'], ' '))
          .to.be.equal('test string')
      })

      it('should contain a working uppercase', () => {
        expect(urlSlug.transformers.uppercase(['test', 'string'], ' '))
          .to.be.equal('TEST STRING')
      })

      it('should contain a working titlecase', () => {
        expect(urlSlug.transformers.titlecase(['tesT', 'strinG'], ' '))
          .to.be.equal('Test String')
      })

    })

    describe('options', () => {

      it('should not accept a separator that is not a string', () => {
        expect(instance.convert.bind(instance, '', 123))
          .to.throw(/^The separator must be a string/)
      })

      it(
        'should only accept a separator defined as unreserved character in ' +
        'RFC 3986',
        () => {
          expect(instance.convert.bind(instance, '', '-._~'))
            .to.not.throw(/^The separator has invalid characters/)
        }
      )

      it(
        'should not accept a separator not defined as unreserved character ' +
        'in RFC 3986',
        () => {
          expect(instance.convert.bind(instance, '', '+'))
            .to.throw(/^The separator has invalid characters/)
        }
      )

      it('should accept false as a transformer option', () => {
        expect(instance.convert.bind(instance, '', '', false))
          .to.not.throw(/^The transformer must be a function/)
      })

      it('should accept all builtin presets as transform', () => {
        expect(instance.convert.bind(instance, '', '', instance.lowercase))
          .to.not.throw(/^The transformer must be a function/)
        expect(instance.convert.bind(instance, '', '', instance.uppercase))
          .to.not.throw(/^The transformer must be a function/)
        expect(instance.convert.bind(instance, '', '', instance.titlecase))
          .to.not.throw(/^The transformer must be a function/)
      })

      it('should accept a function as transform', () => {
        expect(instance.convert.bind(instance, '', () => {}))
          .to.not.throw(/^The transformer must be a function/)
      })

      it(
        'should only accept false, a function or a builtin preset as transform',
        () => {
          expect(instance.convert.bind(instance, '', '', true))
            .to.throw(/^The transformer must be a function/)
          expect(instance.convert.bind(instance, '', '', 'nonexistent'))
            .to.throw(/^The transformer must be a function/)
          expect(instance.convert.bind(instance, '', '', {}))
            .to.throw(/^The transformer must be a function/)
        }
      )

    })

    describe('convert', () => {

      it('should convert input to string', () => {
        expect(instance.convert(123))
          .to.be.equal('123')
      })

      it('should return a default slug if no options are set', () => {
        expect(instance.convert('Url Slug'))
          .to.be.equal('url-slug')
      })

      it('should remove accents', () => {
        expect(instance.convert('á é í ó ú'))
          .to.be.equal('a-e-i-o-u')
      })

      it('should convert to upper case and use default separator', () => {
        expect(instance.convert('a bronx tale', 'uppercase'))
          .to.be.equal('A-BRONX-TALE')
      })

      it('should use underscore separators and title case', () => {
        expect(instance.convert('tom jobim', '_', 'titlecase'))
          .to.be.equal('Tom_Jobim')
      })

      it(
        'should allow multiple characters in separator and not change the case',
        () => {
          expect(instance.convert('Charly García', '-._~-._~', false))
            .to.be.equal('Charly-._~-._~Garcia')
        }
      )

      it('should return a camel case string', () => {
        expect(instance.convert('java script', '', 'titlecase'))
          .to.be.equal('JavaScript')
      })

      it('should break a camel case string', () => {
        expect(instance.convert('javaScript'))
          .to.be.equal('java-script')
      })

      it('should return only consonants', () => {
        const transform = (fragments, separator) => fragments
          .join(separator)
          .replace(/[aeiou]/gi, '')
        expect(instance.convert('React', '', transform))
          .to.be.equal('Rct')
      })

      it('should handle empty strings', () => {
        expect(instance.convert(''))
          .to.be.equal('')
      })

      it('should handle strings with no alphanumeric characters', () => {
        expect(instance.convert('- ( ) [ ]'))
          .to.be.equal('')
      })
    })

    describe('revert', () => {

      it('should convert input to string', () => {
        expect(instance.revert(123))
          .to.be.equal('123')
      })

      it('should use unknown reversion and maintain input case', () => {
        expect(instance.revert('UrlSlug-_url.~slug'))
          .to.be.equal('Url Slug url slug')
      })

      it(
        'should break only on camel case and convert input to upper case',
        () => {
          expect(instance.revert('ClaudioBaglioni_is-Italian', '', 'uppercase'))
            .to.be.equal('CLAUDIO BAGLIONI_IS-ITALIAN')
        }
      )

      it('should return the title of a Pink Floyd track', () => {
        expect(instance.revert('comfortably-._~numb', '-._~', 'titlecase'))
          .to.be.equal('Comfortably Numb')
      })

      it('should empty strings revert to another empty string', () => {
        expect(instance.revert(''))
          .to.be.equal('')
      })

    })

  })

})
