# url-slug [![build status](https://img.shields.io/travis/stldo/url-slug.svg?style=flat)](https://travis-ci.org/stldo/url-slug) [![npm version](https://img.shields.io/npm/v/url-slug.svg?style=flat)](https://www.npmjs.com/package/url-slug)

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

### urlSlug(string, [options]), urlSlug.convert(string, [options])

Returns the __string__ value converted to a slug.

#### string

The string that'll be converted.

#### options

| Name | Description | Default |
| --- | --- | --- |
| camelCase | Split camel case occurrences | `true` |
| separator | Character to split the string: `'-'`, `'.'`, `'_'`, `'~'` or `''` | '-' |
| transformer | A built-in transformer or a custom function (set to `false` to keep the string unchanged) | `urlSlug.transformers.lowercase` |

#### Examples

```javascript
import urlSlug from 'url-slug'

urlSlug('Comfortably Numb', {
  transformer: urlSlug.transformers.uppercase
})
// COMFORTABLY-NUMB

urlSlug('á é í ó ú Á É Í Ó Ú ç Ç æ Æ œ Œ ® © € ¥ ª º ¹ ² ½ ¼', {
  separator: '_',
  transformer: false
})
// a_e_i_o_u_A_E_I_O_U_c_C_ae_AE_oe_OE_r_c_EU_Y_a_o_1_2_1_2_1_4

urlSlug('Red, red wine, stay close to me…', {
  separator: '',
  transformer: urlSlug.transformers.titlecase
})
// RedRedWineStayCloseToMe
```

### urlSlug(string, [separator], [transformer]), urlSlug.convert(string, [separator], [transformer])

> ⚠️ __Warning__: This syntax will be deprecated

Returns the __string__ value converted to a slug.

#### string

Type: `string`

The string that'll be converted.

#### separator

Type: `string`

The character used to separate the slug fragments, set to `'-'` by default. Can be set to `'-'`, `'.'`, `'_'`, `'~'` or `''`.

#### transformer

Type: `function` or `false`

A function that receives the slug fragments and the current separator as arguments. It must return the slug string. Defaults to the built-in transformer `urlSlug.transformers.lowercase`. It can be set to `false` if no transformation is desirable.

#### Examples

```javascript
import urlSlug from 'url-slug'

urlSlug('Comfortably Numb', urlSlug.transformers.uppercase)
// COMFORTABLY-NUMB

urlSlug('á é í ó ú Á É Í Ó Ú ç Ç æ Æ œ Œ ® © € ¥ ª º ¹ ² ½ ¼', '_', false)
// a_e_i_o_u_A_E_I_O_U_c_C_ae_AE_oe_OE_r_c_EU_Y_a_o_1_2_1_2_1_4

urlSlug('Red, red wine, stay close to me…', '', urlSlug.transformers.titlecase)
// RedRedWineStayCloseToMe
```

### urlSlug.revert(slug, [options])

Returns the __slug__ value converted to a regular string.

#### slug

The slug that'll be reverted.

#### options

| Name | Description | Default |
| --- | --- | --- |
| camelCase | Split camel case occurrences | `false` |
| separator | Character to split the string: `'-'`, `'.'`, `'_'`, `'~'` or `''` (set to `null` to use all characters) | `null` |
| transformer | A built-in transformer or a custom function (set to `false` to keep the string unchanged) | `false` |

#### Examples

```javascript
import urlSlug from 'url-slug'

urlSlug.revert('Replace-every_separator.allowed~andSplitCamelCaseToo')
// Replace every separator allowed and Split Camel Case Too

urlSlug.revert('this-title-needs-a-title_case', {
  separator: '-',
  transformer: urlSlug.transformers.titlecase
})
// This Title Needs A Title_case
```

### urlSlug.revert(slug, [separator], [transformer])

> ⚠️ __Warning__: This syntax will be deprecated

Returns the __slug__ value converted to a regular string.

#### slug

Type: `string`

The slug that'll be reverted.

#### separator

Type: `string` or `null`

The value used to split the slug into fragments, set to `null` by default. Can be set to `null`, `'-'`, `'.'`, `'_'`, `'~'` or `''`. If set to `null`, the split will happen on any valid separator character or camel case occurrences. If set to an empty string, only camel case occurrences will be split.

#### transformer

Type: `function` or `false`

A function that receives the string fragments and the current separator as arguments. Defaults to `false`, which means that no transformation will be made.

#### Examples

```javascript
import urlSlug from 'url-slug'

urlSlug.revert('Replace-every_separator.allowed~andSplitCamelCaseToo')
// Replace every separator allowed and Split Camel Case Too

urlSlug.revert(
  'this-title-needs-a-title_case',
  '-',
  urlSlug.transformers.titlecase
)
// This Title Needs A Title_case
```

### urlSlug.UrlSlug([separator], [transformer])

> ⚠️ __Warning__: This syntax will be deprecated

`url-slug` constructor, useful if you want to create more instances. If `separator` or `transform` are set, they will the default values of the instance.

#### separator

Type: `string`

Defaults to `'-'`. Can be set to `'-'`, `'.'`, `'_'`, `'~'` or `''`.

#### transformer

Type: `function` or `false`

Defaults to `urlSlug.transformers.lowercase`. Can be set to a function or `false`, if no transformation is desired.

#### Examples

```javascript
import urlSlug from 'url-slug'

const urlSlugInstance = new urlSlug.UrlSlug('~', urlSlug.transformers.uppercase)

urlSlugInstance.convert('Listen to Fito Páez in Madrid')
// LISTEN~TO~FITO~PAEZ~IN~MADRID
```

### Custom transformers

Custom transformers are expressed by a function which receives two arguments, __fragments__, an array with the resulting words of the conversion, and __separator__, the current separator string used to join the words. On revert, the __separator__ will always be a space character (`' '`). Transformers should always return a string.

#### Examples

```javascript
import urlSlug from 'url-slug'

urlSlug(
  'O\'Neill is an American surfboard, surfwear and equipment brand',
  fragments => fragments.join('+').toUpperCase()
)
// O+NEILL+IS+AN+AMERICAN+SURFBOARD+SURFWEAR+AND+EQUIPMENT+BRAND

urlSlug.revert(
  'WEIrd_SNAke_CAse',
  '_',
  (fragments, separator) => fragments.map(fragment => (
    fragment.slice(0, -2).toLowerCase() + fragment.slice(-2).toUpperCase()
  )).join(separator)
)
// weiRD snaKE caSE
```

### Built-in transformers

#### urlSlug.transformers.lowercase

Converts the result to lowercase.

#### urlSlug.transformers.uppercase

Converts the result to uppercase.

#### urlSlug.transformers.titlecase

Converts the result to title case.

## License

[The MIT License](./LICENSE)
