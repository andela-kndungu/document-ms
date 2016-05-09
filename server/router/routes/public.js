(function() {
  'use strict';

  var router = require('express').Router();
  var UsersController = require('../../controllers/users');

  // Return the home page (GET localhost:8080/)
  router.get('/', function(req, res) {
    res.json({
      success: true,
      message: 'Api active'
    });
  });

  // Create a user (POST localhost:8080/users)
  router.post('/users', UsersController.create);

  // Log in a user (POST localhost:8080/users/login)
  router.post('/users/login', UsersController.login);

  module.exports = router;
})();
