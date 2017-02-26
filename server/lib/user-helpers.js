'use strict';
var ObjectId = require('mongodb').ObjectId;
// Simulates the kind of delay we see with network or filesystem operations

module.exports = function makeUserHelpers(db) {
  return {

    // Saves a user to `db`
    saveUser: function(user, callback) {
      db.collection('users').insertOne(user, callback);
    },

    getUser: function(userId, callback) {
      db.collection('users').find({_id: ObjectId(userId)}).toArray((err, result) => callback(err,result[0]));
    },

    authenticateUser: function(login, callback) {
      db.collection('users').find({email: login.email}).toArray((err, result) => {
        if (result[0]) {
          callback(null,result[0]);
        } else {
          callback('username or password are icorrect');
        }
      });
    }
  }
};
