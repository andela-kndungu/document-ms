(function() {
  'use strict';

  var router = require('express').Router();
  var UsersController = require('../../controllers/users');

  // Create a user (POST localhost:8080/users)
  router.post('/', UsersController.create);

  // Fetch user by ID (GET localhost:8080/users/id)
  router.get('/:id', UsersController.find.id);

  // Fetch all users (GET localhost:8080/users)
  router.get('/', UsersController.find.all);

  // Update user by ID (PUT localhost:8080/users/id)
  router.put('/:id', UsersController.update);

  // Delete user by id (DELETE localhost:8080/users/id)
  router.delete('/:id', UsersController.destroy);

  // Fetch a user's documents (GET localhost:8080/users/id/documents)
  router.get('/:id/documents', UsersController.find.documents);

  module.exports = router;
})();
