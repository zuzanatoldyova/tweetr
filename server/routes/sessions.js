'use strict';

const express        = require('express');
const sessionRoutes    = express.Router();

module.exports = UserHelpers => {

  sessionRoutes.post('/', (req, res) => {
    if(!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    let email = req.body.email;
    let password = req.body.password;
    let credentials = {
      email,
      password
    };

    UserHelpers.authenticateUser(credentials, (err, result) => {
      if (err) {
        res.status(400).json({error: err});
      } else if (result.password === credentials.password) {
        req.session.userId = result._id;
        res.status(201).send(result);
      } else {
        res.status(400).json({error: 'username or password are icorrect' });
      }
    });
  });

  sessionRoutes.delete('/', (req, res) => {
    req.session = null;
    res.status(200).send();
  });

  return sessionRoutes;
};