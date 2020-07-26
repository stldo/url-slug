# url-slug [![build status](https://img.shields.io/travis/stldo/url-slug/master?style=flat)](https://travis-ci.org/stldo/url-slug) [![npm version](https://img.shields.io/npm/v/url-slug.svg?style=flat)](https://www.npmjs.com/package/url-slug)

Lightweight slug generator. It creates slugs compatible with URL hosts, paths, queries and fragments, as specified in RFC 3986. It also offers a method to revert slugs.

## Install

```bash
$ npm install url-slug@beta
```

## Usage

```javascript
import urlSlug from 'url-slug'

urlSlug('Sir James Paul McCartney MBE is an English singer-songwriter')
// sir-james-paul-mc-cartney-mbe-is-an-english-singer-songwriter
```

## Documentation

### urlSlug(string[, options]), convert(string[, options])

Returns `string` value converted to a slug.

#### string

A sentence to be slugified.

#### options

| Name | Description | Default |
| --- | --- | --- |
| camelCase | Split on camel case occurrences | `true` |
| separator | [Character or string](#accepted-separator-characters) used to separate the slug fragments | `'-'` |
| transformer | A built-in transformer or a custom function (`false` to keep the string unchanged) | `LOWERCASE_TRANSFORMER` |

#### Examples

```javascript
import * as urlSlug from 'url-slug'

urlSlug.convert('Comfortably Numb', {
  transformer: urlSlug.UPPERCASE_TRANSFORMER
})
// COMFORTABLY-NUMB

urlSlug.convert('á é í ó ú Á É Í Ó Ú ç Ç ª º ¹ ² ½ ¼', {
  separator: '_',
  transformer: false
})
// a_e_i_o_u_A_E_I_O_U_c_C_a_o_1_2_1_2_1_4

urlSlug.convert('Red, red wine, stay close to me…', {
  separator: '',
  transformer: urlSlug.TITLECASE_TRANSFORMER
})
// RedRedWineStayCloseToMe

urlSlug.convert('Listen to Fito Páez in Madrid', {
  separator: '~',
  transformer: urlSlug.SENTENCECASE_TRANSFORMER
})
// Listen~to~fito~paez~in~madrid
```

### revert(slug[, options])

Returns the `slug` value converted to a regular sentence.

#### slug

A slug to be reverted to a sentence.

#### options

| Name | Description | Default |
| --- | --- | --- |
| camelCase | Split on camel case occurrences | `false` |
| separator | [Character or string](#accepted-separator-characters) to split the slug (`null` accounts to automatic splitting) | `null` |
| transformer | A built-in transformer or a custom function (`false` to keep the string unchanged) | `false` |

#### Examples

```javascript
import { revert, TITLECASE_TRANSFORMER } from 'url-slug'

revert('Replace-every_separator.allowed~andSplitCamelCaseToo', {
  camelCase: true
})
// Replace every separator allowed and Split Camel Case Too

revert('this-slug-needs-a-title_case', {
  separator: '-',
  transformer: TITLECASE_TRANSFORMER
})
// This Slug Needs A Title_case
```

### Custom transformers

Custom transformers are expressed by a function that receives two arguments, `fragments`, an array with matching words from a sentence or a slug, and `separator`, which will be the separator string set in `convert()` options. When `revert()` calls the transformer, the `separator` argument will always be a space character (`' '`) — the `separator` option will be used to split the slug. Transformers should always return a string.

#### Examples

```javascript
import { convert, revert } from 'url-slug'

convert('O’Neill is an American surfboard, surfwear and equipment brand', {
  transformer: fragments => fragments.join('x').toUpperCase()
})
// OxNEILLxISxANxAMERICANxSURFBOARDxSURFWEARxANDxEQUIPMENTxBRAND

revert('WEIrd_SNAke_CAse', {
  separator: '_',
  transformer: (fragments, separator) => fragments.map(fragment => (
    fragment.slice(0, -2).toLowerCase() + fragment.slice(-2).toUpperCase()
  )).join(separator)
})
// weiRD snaKE caSE
```

### Built-in transformers

#### LOWERCASE_TRANSFORMER

Converts the result to lowercase. E.g.: `// SOME WORDS >> some words`

#### SENTENCECASE_TRANSFORMER

Converts the result to sentence case. E.g.: `// sOME WORDS >> Some words`

#### UPPERCASE_TRANSFORMER

Converts the result to uppercase. E.g.: `// some words >> SOME WORDS`

#### TITLECASE_TRANSFORMER

Converts the result to title case. E.g.: `// sOME wORDS >> Some Words`

### Accepted separator characters

Any character defined as _unreserved_ or _sub-delims_ in RFC 3986, or an empty string, can be used as `separator`. When the `separator` is an empty string, the `revert()` method will split the slug only on camel case occurrences — if `camelCase` option is set to `true`, otherwise it will return an untouched string. The following characters are valid:

`-`, `.`, `_`, `~`, `^`, `-`, `.`, `_`, `~`, `!`, `$`, `&`, `'`, `(`, `)`, `*`, `+`, `,`, `;` or `=`

## License

[The MIT License](./LICENSE)
