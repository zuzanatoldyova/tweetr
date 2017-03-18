'use strict';

// Basic express setup:

const PORT           = 8080;
const express        = require('express');
const bodyParser     = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const app            = express();
const path           = require('path');
const {MongoClient}  = require('mongodb');
const DataHelpers    = require('./lib/data-helpers.js');
const UserHelpers    = require('./lib/user-helpers.js');
const tweetsRoutes   = require('./routes/tweets');
const usersRoutes    = require('./routes/users');
const bcrypt         = require('bcrypt');
const cookieSession  = require('cookie-session');
const MONGODB_URI    = 'mongodb://localhost:27017/tweeter';

app.use(cookieSession({
  name: 'session',
  keys: ['secret']
}));

app.use(sassMiddleware({
  src: path.join(__dirname, '../sass/styles'),
  dest: path.join(__dirname, '../public/styles'),
  // debug: true,
  outputStyle: 'compressed',
  prefix: '/styles'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

MongoClient.connect(MONGODB_URI, (err, db) => {

// Mount the tweets routes at the '/tweets' path prefix:

  app.use('/tweets', tweetsRoutes(DataHelpers(db), UserHelpers(db)));
  app.use('/users', usersRoutes(UserHelpers(db)));


  app.post('/login', (req, res) => {
    if(!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    let email = req.body.email;
    let password = req.body.password;
    let login = {
      email,
      password
    };

    UserHelpers(db).authenticateUser(login, (err, result) => {
      if (err) {
        res.status(400).json({error: err});
      } else if (result.password === login.password) {
        req.session.userId = result._id;
        res.status(201).send(result);
      } else {
        res.status(400).json({error: 'username or password are icorrect' });
      }
    });
  });

  app.delete('/login', (req, res) => {
    req.session = null;
    res.status(200).send();
  });
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
