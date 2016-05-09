(function() {
  'use strict';

  var router = require('express').Router();
  var CategoriesController = require('../../controllers/categories');

  // Create a category (POST localhost:8080/categories)
  router.post('/', CategoriesController.create);

  // Fetch category by ID (GET localhost:8080/categories/id)
  router.get('/:id', CategoriesController.find.id);

  // Fetch all categories (GET localhost:8080/categories)
  router.get('/', CategoriesController.find.all);

  // Update category by ID (PUT localhost:8080/cateogries/id)
  router.put('/:id', CategoriesController.update);

  // Delete category by id (DELETE localhost:8080/documents/id)
  router.delete('/:id', CategoriesController.destroy);

  module.exports = router;
})();
