# url-slug [![build status](https://img.shields.io/travis/stldo/url-slug/master?style=flat)](https://travis-ci.org/stldo/url-slug) [![npm version](https://img.shields.io/npm/v/url-slug.svg?style=flat)](https://www.npmjs.com/package/url-slug)

RFC 3986 compliant slug generator with multiple language support. It creates slugs safe for use in URL paths, queries and fragments, and can revert them too.

## Install

```bash
$ npm install url-slug
```

## Usage

```javascript
import urlSlug from 'url-slug'

urlSlug('Sir James Paul McCartney MBE is an English singer-songwriter')
// sir-james-paul-mc-cartney-mbe-is-an-english-singer-songwriter
```

## Documentation

### urlSlug(string[, options]), urlSlug.convert(string[, options])

Returns the __string__ value converted to a slug.

#### string

The string that'll be converted.

#### options

| Name | Description | Default |
| --- | --- | --- |
| camelCase | Split camel case occurrences | `true` |
| separator | Character to split the string: `'-'`, `'.'`, `'_'`, `'~'` or `''` | '-' |
| transformer | A built-in transformer or a custom function (`false` to keep the string unchanged) | `urlSlug.LOWERCASE_TRANSFORMER` |

#### Examples

```javascript
import { * as urlSlug, convert } from 'url-slug'

convert('Comfortably Numb', {
  transformer: urlSlug.UPPERCASE_TRANSFORMER
})
// COMFORTABLY-NUMB

convert('á é í ó ú Á É Í Ó Ú ç Ç ª º ¹ ² ½ ¼', {
  separator: '_',
  transformer: false
})
// a_e_i_o_u_A_E_I_O_U_c_C_a_o_1_2_1_2_1_4

convert('Red, red wine, stay close to me…', {
  separator: '',
  transformer: urlSlug.TITLECASE_TRANSFORMER
})
// RedRedWineStayCloseToMe

convert('Listen to Fito Páez in Madrid', {
  separator: '~',
  transformer: urlSlug.SENTENCECASE_TRANSFORMER
})
// Listen~to~fito~paez~in~madrid
```

### urlSlug.revert(slug[, options])

Returns the __slug__ value converted to a regular string.

#### slug

The slug that'll be reverted.

#### options

| Name | Description | Default |
| --- | --- | --- |
| camelCase | Split camel case occurrences | `false` |
| separator | Character to split the string: `'-'`, `'.'`, `'_'`, `'~'` or `''` (`null` to use all characters) | `null` |
| transformer | A built-in transformer or a custom function (`false` to keep the string unchanged) | `false` |

#### Examples

```javascript
import { * as urlSlug, revert } from 'url-slug'

revert('Replace-every_separator.allowed~andSplitCamelCaseToo', {
  camelCase: true
})
// Replace every separator allowed and Split Camel Case Too

revert('this-slug-needs-a-title_case', {
  separator: '-',
  transformer: urlSlug.TITLECASE_TRANSFORMER
})
// This Slug Needs A Title_case
```

### Custom transformers

Custom transformers are expressed by a function which receives two arguments, __fragments__, an array with matching words from a sentence or a slug, and __separator__, the current separator string set in options. When `revert()` calls the transformer, the __separator__ will always be a space character (`' '`). Transformers should always return a string.

#### Examples

```javascript
import { convert, revert } from 'url-slug'

convert('O’Neill is an American surfboard, surfwear and equipment brand', {
  transformer: fragments => fragments.join('+').toUpperCase()
})
// O+NEILL+IS+AN+AMERICAN+SURFBOARD+SURFWEAR+AND+EQUIPMENT+BRAND

revert('WEIrd_SNAke_CAse', {
  separator: '_',
  transformer: (fragments, separator) => fragments.map(fragment => (
    fragment.slice(0, -2).toLowerCase() + fragment.slice(-2).toUpperCase()
  )).join(separator)
})
// weiRD snaKE caSE
```

### Built-in transformers

#### urlSlug.LOWERCASE_TRANSFORMER

Converts the result to lowercase. E.g.: `// SOME WORDS >> some words`

#### urlSlug.SENTENCECASE_TRANSFORMER

Converts the result to sentence case. E.g.: `// sOME WORDS >> Some words`

#### urlSlug.UPPERCASE_TRANSFORMER

Converts the result to uppercase. E.g.: `// some words >> SOME WORDS`

#### urlSlug.TITLECASE_TRANSFORMER

Converts the result to title case. E.g.: `// sOME wORDS >> Some Words`

## License

[The MIT License](./LICENSE)
