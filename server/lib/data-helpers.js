"use strict";
var ObjectId = require('mongodb').ObjectId;
// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      console.log(newTweet);
      db.collection("tweets").insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
    },

    // Updates tweet according to body of request
    likeTweet: function(tweetId, callback){
      let delta = 1;
      db.collection("tweets").find({_id: ObjectId(tweetId)}).toArray((err, result) => {
        if(result[0].likes > 0) {
          delta = -1;
        }
        db.collection("tweets").update(
          {_id: ObjectId(tweetId)},
          { $inc: { likes: delta } },
          null,
          callback
        );
      });
    }
  };
};


