'use strict';

// Basic express setup:

const PORT          = 8080;
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const path          = require('path');
const {MongoClient} = require('mongodb');
const DataHelpers   = require('./lib/data-helpers.js');
const tweetsRoutes  = require('./routes/tweets');
const MONGODB_URI   = 'mongodb://localhost:27017/tweeter';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../public')));

MongoClient.connect(MONGODB_URI, (err, db) => {

// Mount the tweets routes at the '/tweets' path prefix:

  app.use('/tweets', tweetsRoutes(DataHelpers(db)));

});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
