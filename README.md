# Get the news feed from a Facebook to a Meteor Collection.

This is a package for getting the latest posts from a Facebook Page. This is basically how you do it:

1. Install [Meteor](http://www.meteor.com) and [Meteorite](https://github.com/oortcloud/meteorite/) if you haven't already.
1. Add the http package (`meteor add http`)
1. Run `mrt add fbFeedGetter` in your meteor project. This package should be installed.
1. Create a new Facebook app at [developers.facebook.com](http://developers.facebook.com) (or use one you already have). Take note of the app's `client_id` and `client_secret`.
1. Do the following on the server of your app:
  1. Create a Collection where you want the posts to be stored. Or use one you already have.  
  Example: `FacebookPosts = new Meteor.Collection('facebookPosts');`
  1. Create a new `fbFeedGetter = new FacebookFeedGetter();`
  1. Make sure you have an `access_token` from Facebook for the app you created.  
  (If not, generate one using your developers.facebook.com app's client_id and secret):  
  `// This will return the access_token to your server console.`
  `// Save the access_token and pass it in the next step, don't run this method on every startup`
  `console.log( fbFeedGetter.generateAccessToken(client_id, client_secret) );`
  1. Setup your `FacebookFeedGetter()` using it's `setup()` method.  
  Pass your access_token and the Meteor.Collection where you want to store the posts:  
  `fbFeedGetter.setup(access_token, FacebookPosts);`
  1. Schedule how often you want to check the Facebook-page for new posts using the scheduleFeedFetch method.  
  Pass a `timeInMinutes` (float) how often (in minutes, at least 0.2) you want to check FB for updates, and the `pageId` (integer) you want to get posts from:  
  `fbFeedGetter.scheduleFeedFetch(timeInMinutes, pageId);`
  1. Now your Meteor.Collection will be filled with the latest posts from the pageId you provided every `timeInMinutes` minutes!

Oh, use this responsibly! It may be against Facebook's terms in some way, I'm not sure.

**Please let me know of any bugs/improvements.**
