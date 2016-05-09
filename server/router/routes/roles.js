(function() {
  'use strict';

  var router = require('express').Router();
  var RolesController = require('../../controllers/roles');

  // Create a role (POST localhost:8080/roles)
  router.post('/', RolesController.create);

  // Fetch role by ID (GET localhost:8080/roles/id)
  router.get('/:id', RolesController.find.id);

  // Fetch all roles (GET localhost:8080/roles)
  router.get('/', RolesController.find.all);

  // Update role by ID (PUT localhost:8080/roles/id)
  router.put('/:id', RolesController.update);

  // Delete role by id (DELETE localhost:8080/roles/id)
  router.delete('/:id', RolesController.destroy);

  module.exports = router;
})();
