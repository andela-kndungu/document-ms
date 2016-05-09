(function() {
  'use strict';

  // Set environment variableS in .env file when running locally
  if (!process.env.DATABASE_URI) {
    require('dotenv').config();
  }

  var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    router = require('./server/router'),
    app = express(),
    port = process.env.PORT,
    databaseUri = process.env.DATABASE_URI;

  // Connect to the database and get the connection
  mongoose.connect(databaseUri);
  var dbConnection = mongoose.connection;

  // Provide feedback
  dbConnection.on('error', function(error) {
    console.log(error);
  });
  dbConnection.once('open', function() {
    console.log('Successfully connected to db');
  });

  // Set up bodyParser to get passed parameters and post bodies
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // Handle all routes
  router(app);

  // Start receiving requests
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });

  // To be able to use with supertest
  module.exports = app;
})();
