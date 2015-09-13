const UrlSlug = require('./lib/url-slug');
const urlSlugInstance = UrlSlug.create();

const urlSlug = function (data, options)
{
    return urlSlugInstance.convert(data, options);
};

for (var i in urlSlugInstance) {
    if ('create' !== i && '_' !== i[0] && UrlSlug.hasOwnProperty(i)) {

        urlSlug[i] = urlSlugInstance[i];

        if (urlSlug[i].bind) {
            urlSlug[i] = urlSlug[i].bind(urlSlugInstance);
        }

    }
}

urlSlug.UrlSlug = UrlSlug;

module.exports = urlSlug;
