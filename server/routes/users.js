'use strict';

const UserHelpers    = require('../lib/user-helpers.js');
const express        = require('express');
const usersRoutes    = express.Router();
const md5 = require('md5');

module.exports = function(UserHelpers) {
   usersRoutes.post('/', function(req, res) {
     if (!req.body) {
       res.status(400).json({ error: 'invalid request: no data in POST body'});
       return;
     }

     let email = req.body.email;
     let password = req.body.password;
     let username = req.body.username;
     let handle = req.body.handle;
     let avatar = `https://vanillicon.com/${md5(username)}_50.png`
     let user = {
       email,
       password,
       username,
       handle,
       avatar
     };

     UserHelpers.saveUser(user, (err, result) => {
       if (err) {
         res.status(500).json({ error: err.message });
       } else {
         req.session.userId = user._id;
         res.status(201).send();
       }
     });
   });

   usersRoutes.get('/', function(req, res) {
     if (!req.session.userId) {
       console.log("user not logged in");
     } else {
       let id = req.session.userId;
       console.log(id);
       UserHelpers.getUser(id, (err, result) => {
          if (err) {
             res.status(500).json({error: err.message});
          } else {
            let user = {
              name: result.username,
              handle: result.handle,
              avatars: {
                small: result.avatar
              }
            };
            console.log(user);
            res.json(user);
          }
       });
     }
   });

   return usersRoutes;
}
