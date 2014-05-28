FacebookFeedGetter = function () {

	var that = this;

	// The access_token for FB graph calls
	that.access_token = false;

	// This will reference the Meteor Collection used
	that.meteorCollection = false;

	// Latest update time
	that.latestUpdate = 0;


	/**
	 * Setups the app
	 * @param {String} access_token
	 * @param {Meteor Collection} meteorCollection
	 * @return {Boolean} that.access_token !== false && that.meteorCollection !== false
	 */
	that.setup = function (access_token, meteorCollection) {

		// Make sure we have the HTTP package
		if (!HTTP) throw new Error("You need to add the HTTP package! Run 'meteor add http' please.");

		if (!access_token) throw new Error("You need to pass an access_token!");

		if (!meteorCollection || typeof meteorCollection !== 'object')
			throw new Error("You need to pass a meteorCollection!");

		// Set these values
		that.access_token = access_token;
		that.meteorCollection = meteorCollection;

		// Get the latest updated doc and set the latestUpdate time to it's update_time
		var latestDoc = that.meteorCollection.findOne({}, { sort: { 'updated_time': -1 } });
		if (latestDoc)
			that.latestUpdate = latestDoc.updated_time;

		// Return true (if everything worked out as it should have)
		return (that.access_token !== false && that.meteorCollection !== false);

	};


	/**
	* Setups the app
	* @param {String} client_id
	* @param {String} client_secret
	* @return {String} access_token
	*/
	that.generateAccessToken = function (client_id, client_secret) {

		// Use the graph API to generate an access_token
		var result = HTTP.call('GET', 'https://graph.facebook.com/oauth/access_token',
			{ params: { client_id: client_id, client_secret: client_secret, grant_type: 'client_credentials' }
		});

		// If we don't get any content, throw an error
		if (!result.content) throw new Error("Something went wrong while generating access_token.");

		// The result.content is formatted like this: "access_token=XXXXXX", and we only want the acutal token
		var access_token = result.content.replace(/access_token=/, '');

		return access_token;

	};


	/**
	* Get the feed from a page
	* @param {String} pageId
	* @return {Object} HTTP call result
	*/
	that.getFeed = function (pageId) {

		// access_token must be set
		if (!that.access_token) throw new Error("access_token not set!");

		// The request to get the data
		var result = HTTP.call("GET", 'https://graph.facebook.com/'+pageId+'/feed',
        { params: { access_token: that.access_token } });

		// If we don't get a result, throw an error
    if (!result) throw new Error("Something went wrong with facebook graph request.");

		if (result.statusCode !== 200) throw new Error("Status code is not 200.");

    return result;

	};


	/**
	* The method which will run from the sceduler
	* @param {String} pageId
	* @return nothing
	*/
	that.scheduleFallback = function (pageId) {

		if (!that.access_token || !that.meteorCollection) throw new Error("Error with setup.");
		if (!pageId) throw new Error("No pageId passed to scheduleFallback(pageId).");

		// Get the feed from FB
		var feedFromFB = that.getFeed(pageId);

		// The posts are stored in data.data
		var FBposts = feedFromFB.data.data;

		// Set id to _id and remove posts which are older than the latest update
		FBposts = _.map(FBposts, function (post) {
			if (post.updated_time <= that.latestUpdate) return false;
			post._id = post.id;
			return post;
		});

		// Remove all falsy values
		FBposts = _.compact(FBposts);

		// If there are no new posts, return false and stop this method
		if (FBposts.length < 1)
			return false;

		// Upsert the docs!
		_.each(FBposts, function (post) {
			that.meteorCollection.upsert(post._id, { $set: _.omit(post, '_id') });
		});

		// Update the latestUpdate time
		that.latestUpdate = FBposts[0].updated_time;

	};


	/**
	* Schedule a "fetch" of the news feed of the FB page with the associated pageId
	* @param {Number} intervalInMinutes
	* @param {String} pageId
	* @return {Function} Meteor.setInterval
	*/
	that.scheduleFeedFetch = function (intervalInMinutes, pageId) {

		if (!intervalInMinutes) throw new Error("You must pass an inteval (in minutes).");
		if (intervalInMinutes < 0.2) throw new Error("Interval in minutes must be higher than 0.2 minutes");
		if (!that.access_token || !that.meteorCollection) throw new Error("Error with setup.");
		if (!pageId) throw new Error("No pageId passed to scheduleFeedFetch(intervalInMinutes, pageId).");

		var intervalInMs = intervalInMinutes*60*1000;

		that.scheduleFallback(pageId);

		return Meteor.setInterval(function () {
			that.scheduleFallback(pageId);
		}, intervalInMs);

	};

};
