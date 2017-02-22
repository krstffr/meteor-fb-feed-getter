Package.describe({
  summary: "Gets the news feed from Facebook Pages. (This could do much more in the future as well...)",
  name: "krstffr:fb-feed-getter",
  version: "1.0.3",
  git: "https://github.com/krstffr/meteor-fb-feed-getter"
});

Package.onUse(function (api) {

	api.versionsFrom("METEOR@0.9.0");

  api.use(['underscore', 'http'], 'server');

  api.add_files('fb-feed-getter.js', 'server');

	api.export('FacebookFeedGetter', 'server');

});
