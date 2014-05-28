Package.describe({
  "summary": "Gets the news feed from Facebook Pages. (This could do much more with some extra work...)"
});

Package.on_use(function (api) {

  api.use('underscore', 'server');

  api.add_files('lib/fbFeedGetter.js', 'server');

  if (typeof api.export !== 'undefined') {

    // The main object.
    api.export('FacebookFeedGetter', 'server');

  }

});
