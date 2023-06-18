# url-slug [![Build status][1]][2] [![npm][3]][5] [![npm][4]][5] [![minzipped size][6]][7]

- **Less than 1kB** minified and gzipped;
- Uses default JavaScript APIs, **no dependencies**;
- **SEO** friendly;
- **RFC 3986** compliant, compatible with URL hosts, paths, queries and
  fragments;
- Supports **custom dictionaries** to replace characters;
- Easily **revert slugs**.

## Installation

```bash
npm install url-slug
```

## Usage

```javascript
import urlSlug from 'url-slug'

urlSlug('Sir James Paul McCartney MBE is an English singer-songwriter')
// sir-james-paul-mc-cartney-mbe-is-an-english-singer-songwriter
```

### Usage with Node.js

> ⚠️ Only named exports are available in Node.js.

```javascript
import { convert } from 'url-slug'

urlSlug('Sir James Paul McCartney MBE is an English singer-songwriter')
// sir-james-paul-mc-cartney-mbe-is-an-english-singer-songwriter
```

```javascript
const { convert } = require('url-slug')

urlSlug('Sir James Paul McCartney MBE is an English singer-songwriter')
// sir-james-paul-mc-cartney-mbe-is-an-english-singer-songwriter
```

### urlSlug(value[, options]), convert(value[, options])

Returns `value` value converted to a slug.

#### value

A string to be slugified.

#### options

| Name        | Description                                                                       | Default                 |
| ----------- | --------------------------------------------------------------------------------- | ----------------------- |
| camelCase   | Split on camel case occurrences                                                   | `true`                  |
| dictionary  | [Chars to be replaced][8]                                                         | `{}`                    |
| separator   | [Character or string][9] used to separate the slug fragments                      | `'-'`                   |
| transformer | A built-in transformer or a custom function (`null` to keep the string unchanged) | `LOWERCASE_TRANSFORMER` |

#### Examples

```javascript
import * as urlSlug from 'url-slug'

urlSlug.convert('Comfortably Numb', {
  transformer: urlSlug.UPPERCASE_TRANSFORMER,
})
// COMFORTABLY-NUMB

urlSlug.convert('á é í ó ú Á É Í Ó Ú ç Ç ª º ¹ ² ½ ¼', {
  separator: '_',
  transformer: false,
})
// a_e_i_o_u_A_E_I_O_U_c_C_a_o_1_2_1_2_1_4

urlSlug.convert('Red, red wine, stay close to me…', {
  separator: '',
  transformer: urlSlug.TITLECASE_TRANSFORMER,
})
// RedRedWineStayCloseToMe

urlSlug.convert('Schwarzweiß', {
  dictionary: { ß: 'ss', z: 'z ' },
})
// schwarz-weiss
```

### revert(value[, options])

Returns the `value` value converted to a regular sentence.

#### value

A slug to be reverted to a sentence.

#### options

| Name        | Description                                                                       | Default |
| ----------- | --------------------------------------------------------------------------------- | ------- |
| camelCase   | Split on camel case occurrences                                                   | `false` |
| separator   | [Character or string][9] to split the slug (`null` for automatic splitting)       | `null`  |
| transformer | A built-in transformer or a custom function (`null` to keep the string unchanged) | `false` |

#### Examples

```javascript
import { revert, TITLECASE_TRANSFORMER } from 'url-slug'

revert('Replace-every_separator.allowed~andSplitCamelCaseToo', {
  camelCase: true,
})
// Replace every separator allowed and Split Camel Case Too

revert('this-slug-needs-a-title_case', {
  separator: '-',
  transformer: TITLECASE_TRANSFORMER,
})
// This Slug Needs A Title_case
```

### Custom transformers

Custom transformers are expressed by a function that receives two arguments:
`fragments`, an array containing the words of a sentence or a slug, and
`separator`, which is the separator string set in `convert()` options. When
`revert()` calls a transformer, the `separator` argument will always be a space
character (`' '`) — the `separator` option will be used to split the slug.
Transformers should always return a string.

#### Examples

```javascript
import { convert, revert } from 'url-slug'

convert('O’Neill is an American surfboard, surfwear and equipment brand', {
  transformer: (fragments) => fragments.join('x').toUpperCase(),
})
// OxNEILLxISxANxAMERICANxSURFBOARDxSURFWEARxANDxEQUIPMENTxBRAND

revert('WEIrd_SNAke_CAse', {
  separator: '_',
  transformer: (fragments, separator) =>
    fragments
      .map(
        (fragment) =>
          fragment.slice(0, -2).toLowerCase() + fragment.slice(-2).toUpperCase()
      )
      .join(separator),
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

### Separator characters

Any character or an empty string can be used in the `separator` property. When
the `separator` is an empty string, the `revert()` method will split the slug
only on camel case occurrences if `camelCase` option is set to `true`,
or else it returns an untouched string. The following characters are valid
according to RFC 3986 — defined as _unreserved_ or _sub-delims_ —, and will be
used in `revert()` function if automatic splitting is enabled — `separator` is
set to `null`:

`-`, `.`, `_`, `~`, `^`, `-`, `.`, `_`, `~`, `!`, `$`, `&`, `'`, `(`, `)`, `*`,
`+`, `,`, `;` or `=`

### `dictionary` option

It must be an object, with keys set as single characters and values as strings
of any length:

```js
import { convert } from 'url-slug'

convert('♥øß', {
  dictionary: {
    '♥': 'love',
    ø: 'o',
    ß: 'ss',
    //...
  },
})
// loveoss
```

To add separators before or after a specific character, add a space before or
after the dictionary definition:

```js
import { convert } from 'url-slug'

convert('♥øß', {
  dictionary: {
    '♥': 'love',
    ø: ' o', // A space was added before
    ß: 'ss',
    //...
  },
})
// love-oss

convert('♥øß', {
  dictionary: {
    '♥': 'love',
    ø: ' o ', // A space was added before and after
    ß: 'ss',
    //...
  },
})
// love-o-ss

convert('♥øß', {
  dictionary: {
    '♥': 'love',
    ø: 'o ', // A space was added after
    ß: 'ss',
    //...
  },
})
// loveo-ss
```

### Compatibility

Compatible with any environment with ES6 support.

## License

[The MIT License][license]

[1]: https://img.shields.io/github/actions/workflow/status/stldo/url-slug/test.yml?branch=master
[2]: https://github.com/stldo/url-slug/actions/workflows/test.js.yml
[3]: https://img.shields.io/npm/dm/url-slug
[4]: https://img.shields.io/npm/v/url-slug
[5]: https://www.npmjs.com/package/url-slug
[6]: https://img.shields.io/bundlephobia/minzip/url-slug
[7]: https://bundlephobia.com/package/url-slug
[8]: #dictionary-option
[9]: #separator-characters
[license]: ./LICENSE
