(function() {
  'use strict';

  var Documents = require('../models/documents');
  var Categories = require('../models/categories');
  var parseError = require('./parseError');

  module.exports = {
    // Add a new category
    create: function(req, res) {
      // Declare new instance of the Documents model
      var document = new Documents();

      // Define values of the new objet to add
      document.owner_id = req.body.owner_id;
      document.title = req.body.title;
      document.content = req.body.content;
      document.category = req.body.category;
      document.access_rights = req.body.access_rights;

      // Save the new category parsing the error if request is invalid
      document.save(function(error) {
        if (error) {
          return parseError(res, error);
        }

        // Category created, return success message
        return res.json({
          success: true,
          message: 'Document created successfully',
          entry: document
        });
      });
    },

    // Handle all get requests for documents
    find: {
      // Retrieve by ID
      id: function(req, res) {
        Documents.findById(req.params.id, function(error, document) {
          // Inform user of errors with the database
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'There was a databse error'
            });
          }

          // Success, return retrieved document with success message
          if (document) {
            return res.json({
              success: true,
              message: 'Document retrieved',
              entry: document
            });
          }

          // Failed, no document with specified ID
          return res.status(404).json({
            success: false,
            message: 'Document does not exist',
          });
        });
      },

      // Retrieve all documents
      all: function(req, res) {
        // Number of documents to be returned
        var limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

        // Start page
        var page = req.query.page ? parseInt(req.query.page, 10) : undefined;

        // Returns the values when executed
        var query = Documents.find();

        // If a specific page is requested with a limit
        if (page) {
          // Move the cursor of the query result to skip
          var skip = page > 0 ? ((page - 1) * limit) : 0;
          query.skip(skip);
        }

        // If a limit is defined add it to the query
        if (limit) {
          query.limit(limit);
        }

        // Sort by date in descendig order (latest first)
        query.sort({
          created_at: -1
        });

        // Execute the query and return the results
        query.exec(function(error, documents) {
          // Inform user of errors with the database
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'There was a databse error'
            });
          }

          // Success, return retrieved documents with success message
          return res.json({
            success: true,
            message: 'Documents retrieved',
            entry: documents
          });
        });
      }
    },

    // Update document by ID
    update: function(req, res) {
      // Get the document to update
      Documents.findById(req.params.id, function(error, document) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was a databse error'
          });
        }

        // Document found, update it
        if (document) {
          // For each property sent in the body
          Object.keys(req.body).forEach(function(property) {
            // Update the document
            document[property] = req.body[property];
          });

          // Save the updated document
          document.save(function(error) {
            // Parse any error and pass on to user
            if (error) {
              return parseError(res, error);
            }
            // Document updated, return success message
            return res.json({
              success: true,
              message: 'Category created successfully',
              entry: document
            });
          });
        }

        // Failed, no document with specified ID
        return res.status(404).json({
          success: false,
          message: 'Document does not exist',
        });
      });
    },

    // Delete specified document
    destroy: function(req, res) {
      // Find document to delete
      Documents.findByIdAndRemove(req.params.id, function(error, document) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was a databse error'
          });
        }

        // Document deleted, return success message
        if (document) {
          return res.json({
            success: true,
            message: 'Document deleted successfully'
          });
        }

        // Failed, no document with specified ID
        return res.status(404).json({
          success: false,
          message: 'Document does not exist',
        });
      });
    },
    search: function(req, res) {
      // Using query builder
      var query = Documents.find();

      // Only return documents marked as public
      query.where('access_rights').equals('public');

      // Return documents created on a specific day
      if (req.query.date) {
        var millisecondsInDay = 86400000;
        var requestedDay = new Date(req.query.date);
        var nextDay = new Date(requestedDay.getTime() + millisecondsInDay);
        query.where('created_at')
          .gte(requestedDay)
          .lt(nextDay);
      }

      // Returns all documents in requested category
      if (req.query.category) {
        // Find requested category in the Categories model
        Categories.find()
          .where('title').equals(req.query.category)
          .exec(function(error, categories) {
            if (error) {
              throw error;
            }
            // If the category is found
            if (categories[0]) {
              // Look for documents with the category's id
              query.where('category').equals(categories[0]._id);
            } else {
              res.status(400).json({
                success: false,
                message: 'Category does not exist'
              });
            }

          });
      }

      // Returns all documents in requested category
      if (req.query.role) {
        query.where('role_of_creator').equals(req.query.role);
      }

      // If a limit is defined add it to the query
      if (req.query.limit) {
        query.limit(parseInt(req.query.limit, 10));
      }

      // Sort by date in descendig order (latest first)
      query.sort({
        created_at: -1
      });

      // Execute the query and return the results
      query.exec(function(error, documents) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was a databse error'
          });
        }
        // Success, return retrieved documents with success message
        return res.json({
          success: true,
          message: 'Documents retrieved',
          entry: documents
        });
      });
    }
  };
})();
