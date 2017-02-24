"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const path          = require('path');
const {MongoClient} = require("mongodb");
const DataHelpers   = require("./lib/data-helpers.js");
const tweetsRoutes  = require("./routes/tweets");
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

MongoClient.connect(MONGODB_URI, (err, db) => {

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.


// Mount the tweets routes at the "/tweets" path prefix:

  app.use("/tweets", tweetsRoutes(DataHelpers(db)));

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
