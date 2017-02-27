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

    // Updates tweetlikes according to if it's already been liked by signed in user or not
    likeTweet: function(tweetId, userId, callback){
      let delta = 1;
      db.collection('tweets').find({_id: ObjectId(tweetId)}).toArray((err, result) => {
        if(result[0].likedby.includes(userId)) {
          delta = -1;
          db.collection('tweets').update(
            { _id: ObjectId(tweetId) },
            { $inc: { likes: delta },
              $pull: { likedby: userId }
            });
          callback(null, result[0])
        } else {
          db.collection('tweets').update(
            { _id: ObjectId(tweetId) },
            { $inc: { likes: delta },
              $push: { likedby: userId }
            });
          callback(null, result[0])
        }
      });
    }
  };
};
