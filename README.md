# url-slug [![License][1]][license] [![Build status][2]][3] [![npm][4]][6] [![npm][5]][6] [![minzipped size][7]][8]

- **Zero dependencies** for a minimal bundle footprint
- **Ultra-lightweight**, weighing in at **~700 bytes** minified and gzipped
- **TypeScript-ready** with built-in type definitions
- **ES6-compatible** for use in all modern environments
- **SEO-friendly**, generating clean, readable URL slugs
- **RFC 3986-compliant** by default
- Customize slug generation with **custom replacements**
- Easily **revert slugs** back into regular sentences

## Installation

```bash
npm install url-slug
```

## Usage

```javascript
import urlSlug from "url-slug";

urlSlug("Sir James Paul McCartney MBE is an English singer-songwriter");
// sir-james-paul-mc-cartney-mbe-is-an-english-singer-songwriter
```

### convert(value[, options])

Returns the `value` converted to a slug.

#### value

The string to be slugified.

#### options

|Name|Description|Default|
|---|---|---|
|`camelCase`|Split on camel case occurrences|`true`|
|`dictionary`|[Characters to be replaced](#dictionary-option)|`{}`|
|`separator`|[Character or string](#separator-characters) used to separate the slug fragments|`"-"`|
|`transformer`|A built-in transformer or a custom function (`null` to leave the string unchanged)|`LOWERCASE_TRANSFORMER`|

#### Examples

```javascript
import {
  TITLECASE_TRANSFORMER,
  UPPERCASE_TRANSFORMER,
  convert,
} from "url-slug";

convert("Comfortably Numb", {
  transformer: UPPERCASE_TRANSFORMER,
});
// COMFORTABLY-NUMB

convert("á é í ó ú Á É Í Ó Ú ç Ç ª º ¹ ² ½ ¼", {
  separator: "_",
  transformer: false,
});
// a_e_i_o_u_A_E_I_O_U_c_C_a_o_1_2_1_2_1_4

convert("Red, red wine, stay close to me…", {
  separator: "",
  transformer: TITLECASE_TRANSFORMER,
});
// RedRedWineStayCloseToMe

convert("Schwarzweiß", {
  dictionary: { ß: "ss", z: "z " },
});
// schwarz-weiss
```

### revert(value[, options])

Returns the `value` converted back into a regular sentence.

#### value

The slug to be reverted to a sentence.

#### options

|Name|Description|Default|
|---|---|---|
|`camelCase`|Split on camel case occurrences|`false`|
|`separator`|[Character or string](#separator-characters) used to split the slug (`null` for automatic splitting)|`null`|
|`transformer`|A built-in transformer or a custom function (`null` to leave the string unchanged)|`false`|

#### Examples

```javascript
import { TITLECASE_TRANSFORMER, revert } from "url-slug";

revert("Replace-every_separator.allowed~andSplitCamelCaseToo", {
  camelCase: true,
});
// Replace every separator allowed and Split Camel Case Too

revert("this-slug-needs-a-title_case", {
  separator: "-",
  transformer: TITLECASE_TRANSFORMER,
});
// This Slug Needs A Title_case
```

### Custom transformers

A custom transformer is a function that receives two arguments: `fragments`,
an array containing the words of a sentence or slug, and `separator`, the
separator string set in the `convert()` options. When `revert()` calls a
transformer, the `separator` argument is always a space character (`" "`) —
the `separator` option is used only to split the slug. Transformers must
always return a string.

#### Examples

```javascript
import { convert, revert } from "url-slug";

convert("O’Neill is an American surfboard, surfwear and equipment brand", {
  transformer: (fragments) => fragments.join("x").toUpperCase(),
});
// OxNEILLxISxANxAMERICANxSURFBOARDxSURFWEARxANDxEQUIPMENTxBRAND

revert("WEIrd_SNAke_CAse", {
  separator: "_",
  transformer: (fragments, separator) =>
    fragments
      .map(
        (fragment) =>
          fragment.slice(0, -2).toLowerCase() + fragment.slice(-2).toUpperCase()
      )
      .join(separator),
});
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

Any character, or an empty string, can be used as the `separator`. When the
`separator` is an empty string, `revert()` will split the slug only on camel
case occurrences if the `camelCase` option is set to `true`; otherwise, it
returns the string unchanged. The following characters are valid according to
RFC 3986 — defined as _unreserved_ or _sub-delims_ — and are used by
`revert()` when automatic splitting is enabled, i.e. when `separator` is set
to `null`:

`-`, `.`, `_`, `~`, `^`, `-`, `.`, `_`, `~`, `!`, `$`, `&`, `'`, `(`, `)`, `*`,
`+`, `,`, `;` or `=`

### `dictionary` option

This option must be an object whose keys are single characters and whose
values are strings of any length:

```js
import { convert } from "url-slug";

convert("♥øß", {
  dictionary: {
    "♥": "love",
    ø: "o",
    ß: "ss",
    //...
  },
});
// loveoss
```

To add separators before or after a specific character, include a space
before or after the replacement value in the dictionary:

```js
import { convert } from "url-slug";

convert("♥øß", {
  dictionary: {
    "♥": "love",
    ø: " o", // A space was added before
    ß: "ss",
    //...
  },
});
// love-oss

convert("♥øß", {
  dictionary: {
    "♥": "love",
    ø: " o ", // A space was added before and after
    ß: "ss",
    //...
  },
});
// love-o-ss

convert("♥øß", {
  dictionary: {
    "♥": "love",
    ø: "o ", // A space was added after
    ß: "ss",
    //...
  },
});
// loveo-ss
```

### Compatibility

Compatible with any environment that supports ES6.

## License

[The MIT License][license]

Copyright (C) 2015-present stldo

[1]: https://img.shields.io/github/license/stldo/url-slug
[2]: https://img.shields.io/github/actions/workflow/status/stldo/url-slug/test.yml?branch=master
[3]: https://github.com/stldo/url-slug/actions/workflows/test.js.yml
[4]: https://img.shields.io/npm/dm/url-slug
[5]: https://img.shields.io/npm/v/url-slug
[6]: https://www.npmjs.com/package/url-slug
[7]: https://img.shields.io/bundlejs/size/url-slug
[8]: https://bundlejs.com/?q=url-slug
[license]: ./LICENSE
