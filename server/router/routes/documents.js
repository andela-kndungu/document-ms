(function() {
  'use strict';

  var router = require('express').Router();
  var DocumentsController = require('../../controllers/documents');

  // Create a document (POST localhost:8080/documents)
  router.post('/', DocumentsController.create);

  // Fetch document by ID (GET localhost:8080/documents/id)
  router.get('/:id', DocumentsController.find.id);

  // Fetch all documents (GET localhost:8080/documents)
  router.get('/', DocumentsController.find.all);

  // Update document by ID (PUT localhost:8080/documents/id)
  router.put('/:id', DocumentsController.update);

  // Delete document by id (DELETE localhost:8080/documents/id)
  router.delete('/:id', DocumentsController.destroy);

  // Search documents (DELETE localhost:8080/documents/search)
  router.get('/search', DocumentsController.search);

  module.exports = router;
})();
