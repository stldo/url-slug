const Iconv = require('iconv').Iconv;
const util = require('util');

const iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT//IGNORE');

const RFC3986_CHARS = ['-', '.', '_', '~', '!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '=', ':', '@'];

const ERROR_INVALID_CHAR = '"%s": invalid value in %s, must be a valid RFC 3986 path character ("' +
    RFC3986_CHARS.join('", "').replace(', "@', ' or "@') + '")';
const ERROR_INVALID_CASE = '"%s": invalid value in options.case, must be UrlSlug.LOWER_CASE, UrlSlug.UPPER_CASE, ' +
    'UrlSlug.TITLE_CASE or UrlSlug.KEEP_CASE';

module.exports = {

    LOWER_CASE: 1,
    UPPER_CASE: 2,
    TITLE_CASE: 3,
    KEEP_CASE: 4,

    _allow: null,

    _separator: null,

    _case: null,

    _parseOptions: function (options)
    {
        if (!options) {
            return {};
        }

        if (options.hasOwnProperty('allow')) {
            if (!options.allow) {
                options.allow = [];
            } else if (!Array.isArray(options.allow)) {
                options.allow = (options.allow + '').split('');
            }

            for (var i = 0; i < options.allow.length; i++) {
                if (-1 === RFC3986_CHARS.indexOf(options.allow[i])) {
                    throw new Error(util.format(ERROR_INVALID_CHAR, options.allow[i], 'options.allow'));
                }
            }

            options.allow._regExp = {
                filter: new RegExp(
                    '[^A-Za-z0-9' + (options.allow.length ? '\\' + options.allow.join('\\') : '') + ']+|([a-z])([A-Z])',
                    'g'
                )
            };
        }

        if (options.hasOwnProperty('separator')) {

            if ('' !== options.separator && -1 === RFC3986_CHARS.indexOf(options.separator)) {
                throw new Error(util.format(ERROR_INVALID_CHAR, options.separator, 'options.separator'));
            }

            if (!(options.separator instanceof String)) {
                options.separator = new String(options.separator);
            }

            if (options.separator.length) {
                options.separator._regExp = {
                    filter: new RegExp(
                        '^\\' + options.separator + '+|^\\' + options.separator + '+$|\\' + options.separator + '+$',
                        'g'
                    ),
                    titleCase: new RegExp(
                        '^[a-z]|\\' + options.separator + '[a-z]',
                        'g'
                    ),
                    self: new RegExp(
                        '\\' + options.separator,
                        'g'
                    ),
                };
            } else {
                options.separator._regExp = {
                    titleCase: /^[a-z]/g,
                };
            }
        }

        if (options.hasOwnProperty('case') && (1 > options.case || 4 < options.case)) {
            throw new Error(util.format(ERROR_INVALID_CASE, options.case));
        }

        return options;
    },

    create: function (options)
    {
        var UrlSlug = Object.create(this);

        options = options || {};
        options = this._parseOptions({
            allow: options.allow || [],
            separator: options.separator || '-',
            case: options.case || this.LOWER_CASE,
        });

        /* Set defaults */
        UrlSlug._allow = options.allow;
        UrlSlug._separator = options.separator;
        UrlSlug._case = options.case;

        return UrlSlug;
    },

    convert: function (data, options)
    {
        options = this._parseOptions(options);

        var allow = options.allow || this._allow;
        var separator = options.separator || this._separator;
        var stringCase = options.case || this._case;

        if (!(data = (data || 0 === data ? data : '') + '')) {
            return '';
        }

        /* Convert non US-ASCII characters */
        data = iconv.convert(data.normalize('NFKD')).toString();

        /* Keep only allowed characters */
        data = data.replace(allow._regExp.filter, '$1' + separator + '$2');

        /* Remove separator char from the beggining and the end of the slug */
        if (separator._regExp.filter) {
            data = data.replace(separator._regExp.filter, '');
        }

        /* Set the case of the slug */
        if (this.LOWER_CASE === stringCase) {
            data = data.toLowerCase();
        } else if (this.UPPER_CASE === stringCase) {
            data = data.toUpperCase();
        } else if (this.TITLE_CASE === stringCase) {
            data = data.toLowerCase().replace(separator._regExp.titleCase, function (match) {
                return match.toUpperCase();
            });
        }

        return data;
    },

    revert: function (data, options)
    {
        options = this._parseOptions(options);

        var separator = options.separator || this._separator;
        var stringCase = options.case || this._case;

        if (this.LOWER_CASE === stringCase) {
            data = data.toLowerCase();
        } else if (this.UPPER_CASE === stringCase) {
            data = data.toUpperCase();
        } else if (this.TITLE_CASE === stringCase) {
            data = data.toLowerCase().replace(separator._regExp.titleCase, function (match) {
                return match.toUpperCase();
            });
        }

        if (separator._regExp.self) {
            data = data.replace(separator._regExp.self, ' ');
        }

        return data;
    },

};
