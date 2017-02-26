'use strict';
var ObjectId = require('mongodb').ObjectId;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection('tweets').find().toArray(callback);
    },

    // Updates tweetlikes according to if it's already been liked or not
    likeTweet: function(tweetId, callback){
      let delta = 1;
      db.collection('tweets').find({_id: ObjectId(tweetId)}).toArray((err, result) => {
        if(result[0].likes > 0) {
          delta = -1;
        }
        db.collection('tweets').update(
          {_id: ObjectId(tweetId)},
          { $inc: { likes: delta } },
          null,
          callback
        );
      });
    }
  };
};
