Package.describe({
  "summary": "Gets the news feed from Facebook Pages. (This could do much more with some extra work...)"
});

Package.onUse(function (api) {

  api.use('underscore', 'server');

  api.add_files('lib/facebook-feed-getter.js', 'server');

	api.export('FacebookFeedGetter', 'server');

});
