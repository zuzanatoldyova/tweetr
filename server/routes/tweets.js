'use strict';

const userHelper    = require('../lib/util/user-helper');
const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers, UserHelpers) {

  tweetsRoutes.get('/', function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post('/', function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    let user = userHelper.generateRandomUser();
    if (req.session.userId) {
      let id = req.session.userId;
      UserHelpers.getUser(id, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          user = {
            name: result.username,
            handle: result.handle,
            avatars: {
              small: result.avatar
            }
          };
          const tweet = {
            user: user,
            content: {
              text: req.body.text
            },
            created_at: Date.now(),
            likes: 0,
            likedby: []
          };
          DataHelpers.saveTweet(tweet, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send();
            }
          });
        }
      });
    }
  });

  tweetsRoutes.post('/:id/likes', function(req, res) {
    if (!req.body.id ) {
      res.status(400).json({ error: 'invalid request: no data in PUT body'});
      return;
    }
    if(!req.session.userId) {
      res.status(400).json({error: 'you must be logged in to like tweets'});
      return;
    }
    let id = req.session.userId;
    DataHelpers.likeTweet(req.body.id, id, (err, result) =>{
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json(result);
      }
    });

  });

  return tweetsRoutes;

};
