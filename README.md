# node-url-slug

Very flexible slug generator complying with RFC 3986 and support for multiple languages.

## Features

- RFC 3986 compliant
- Create safe slugs for use in path and query parts
- Uses NFKD normalization and iconv transliteration
- Splits camel case words (i.e. camelCase => camel-case)
- Slug reversion (i.e. slug-reversion => Slug Reversion)
- Fully configurable

## Installation

```bash
$ npm install url-slug
```

## Usage

```js
var urlSlug = require('url-slug');

var slug = urlSlug(string[, options]);
```

## Examples

### Converting a string to a slug

```js
urlSlug('Sir James Paul McCartney MBE is an English singer-songwriter');
// sir-james-paul-mc-cartney-mbe-is-an-english-singer-songwriter
```

### Convert Unicode to ASCII while keeping the case

```js
urlSlug('á é í ó ú Á É Í Ó Ú ç Ç æ Æ œ Œ ® © ™ € ¥ ª º ¹ ² ½ ¼', {
    case: urlSlug.KEEP_CASE,
});
// a-e-i-o-u-A-E-I-O-U-c-C-ae-AE-oe-OE-R-c-TM-EUR-yen-a-o-1-2-1-2-1-4
```

### No separator at all

```js
urlSlug('Red, red wine, stay close to me…', {
    separator: '',
});
// redredwinestayclosetome
```

### Title case slug

```js
urlSlug('My fabulous title needs a title case', {
    case: urlSlug.TITLE_CASE,
});
// My-Fabulous-Title-Needs-A-Title-Case
```

### Upper case with underscore separator

```js
urlSlug("O'Neill is an American surfboard, surfwear and equipment brand", {
    case: urlSlug.UPPER_CASE,
    separator: '_',
});
// O_NEILL_IS_AN_AMERICAN_SURFBOARD_SURFWEAR_AND_EQUIPMENT_BRAND
```

### Allow specific characters

```js
urlSlug('Hostels in Rio de Janeiro from $9.5/night', {
    allow: ['$', '.'], // or just a string (i.e. '.$')
});
// hostels-in-rio-de-janeiro-from-$9.5-night
```

### Reverting back a slug

```js
urlSlug.revert('hostels+in+rio+de+janeiro+from+$9.5+night', {
    case: urlSlug.TITLE_CASE,
    separator: '+',
});
// Hostels In Rio De Janeiro From $9.5 Night
```

## API

### urlSlug(string[, options]), .convert(string[, options])

Converts a string to a slug.

```js
// Default options
options = {
    allow: [],
    separator: '-',
    case: urlSlug.LOWER_CASE,
}
```

### .revert(string[, options])

Converts a slug to human format.

```js
// Default options
options = {
    separator: '-',
    case: urlSlug.TITLE_CASE,
}
```

### .LOWER_CASE

convert to lower case.

### .UPPER_CASE

CONVERT TO UPPER CASE.

### .TITLE_CASE

Convert To Title Case.

### .KEEP_CASE

DoN't mOdifY tHe caSe.

## Options

### allow (array|string)

Characters that shouldn't be replaced by separator. Must be RFC 3986 compliant (see bellow).

### separator (string)

Character used to separate words in `.convert()`, or to be replaced by whitespace in `.revert()`. Must be RFC 3986 compliant (see bellow).

### case (int)

It must be one of these values: `urlSlug.LOWER_CASE`, `urlSlug.UPPER_CASE`, `urlSlug.TITLE_CASE` or `urlSlug.KEEP_CASE`.

## RFC 3986 compliant characters

Besides `A-Z`, `a-z` and `0-9`, the specification allows the following characters in a path segment:

```
"-", ".", "_", "~", "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "=", ":", "@"
```

## Creating a new instance

A new instance can be created with its own defaults, useful when doing multiple conversions. Note that `.convert()` method should be used in this case.

```js
var UrlSlug = require('url-slug').UrlSlug;

var urlSlug = UrlSlug.create({
    allow: ['(', ')'],
    separator: ':',
    case: UrlSlug.UPPER_CASE,
});

urlSlug.convert('Listen to Charly García (before going to Buenos Aires)');
// LISTEN:TO:CHARLY:GARCIA:(BEFORE:GOING:TO:BUENOS:AIRES)
```

## TODO

- Remove unwanted characters using `data.replace(disallow._regexp.filter, '')` before iconv
- Url queries can have `"/"` and `"?"` characters, allow them if options.query is set to true
- `.setOptions()` method, useful for global instance configuration
- Camel case split as an option
- Simplify code
- Locale settings on iconv through `options.locale`
- Support for browsers?
- Tests?
