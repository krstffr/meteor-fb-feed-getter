# DEPRECATED: fbFeedGetter

Get the news feed from a Facebook page to a Meteor Collection.

## Basic usage

This is a package for getting the latest posts from a Facebook Page. This is basically how you do it:

1. Install [Meteor](http://www.meteor.com) and [Meteorite](https://github.com/oortcloud/meteorite/) if you haven't already.
1. Add the http package (`meteor add http`)
1. Run `mrt add facebook-feed-getter` in your meteor project. This package should be installed.
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


## Filter posts based on key

Maybe you only want the posts which have the "message" key (cause you don't want to store comments and such).
Then just add "message" to the `fbPostRequiredFields` array, like this:  
`fbFeedGetter.fbPostRequiredFields = ['message'];`

And you can of course add how many keys as you'd like to this array.
`fbFeedGetter.fbPostRequiredFields = ['message', 'picture', 'likes'];`

And this will make only posts which contain these keys be saved.


## Run one or more transform methods on the resulted posts

Maybe you want to do something to the posts which are returned from the Facebook API before you save them to the DB? Just pass the callback method to the addTransformMethodForRetrievedObjects() method. See below:

```javascript

// This method will run on each post which is returned from the API
// and will attach the actual image URL to each post (as it's not actually
// stored in the original object).
// Remember: you must return the modified (or original) object.
fbFeedGetter.addTransformMethodForRetrievedObjects(function ( fbObject ) {

  // If the fbObjet has no object_id, just return it
  if (!fbObject.object_id)
    return fbObject;
  
  // This is the HTTP request we use to get the response
  var imgResponse = HTTP.get( 'https://graph.facebook.com/v2.0/'+fbObject.object_id+'/picture',
    {
      params: {
        // Redirect has to be false, else the actual FILE will be return
        redirect: false,
        access_token: access_token
      }
    });
  
  // Set the actualPicture to the new URL
  fbObject.actualPicture = imgResponse.data.data.url;

  // Return it!
  return fbObject;

});

```


## Bugs?

**Please let me know of any bugs/improvements.**
