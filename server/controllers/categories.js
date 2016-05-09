(function() {
  'use strict';

  var Categories = require('../models/categories');
  var parseError = require('./parseError');

  module.exports = {
    // Add a new category
    create: function(req, res) {
      // Declare new instance of the Categories model
      var category = new Categories();

      // Define values of the new object to add
      category.title = req.body.title;

      // Save the new category parsing the error if request is invalid
      category.save(function(error) {
        if (error) {
          return parseError(res, error);
        }
        // Category created, return success message
        return res.json({
          success: true,
          message: 'Category created successfully',
          entry: category
        });
      });
    },

    // Handle all get requests for categories
    find: {
      // Retrieve by ID
      id: function(req, res) {
        Categories.findById(req.params.id, function(error, category) {
          // Inform user of errors with the database
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'There was an error reading from the database'
            });
          }
          // Success, return retrieved category with success message
          if (category) {
            return res.json({
              success: true,
              message: 'Category retrieved',
              entry: category
            });
          }
          // Failed, no document with specified ID
          return res.json({
            success: false,
            message: 'Category does not exist',
          });
        });
      },

      // Retrieve all categories
      all: function(req, res) {
        // Get all entries in the categories model
        Categories.find({}, function(error, categories) {
          // Inform user of errors with the database
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'There was an error reading from the database'
            });
          }
          // Success, return retrieved categories with success message
          return res.json({
            success: true,
            message: 'Categories retrieved',
            entry: categories
          });
        });
      }
    },

    // Update user by ID
    update: function(req, res) {
      // Get the category to update
      Categories.findById(req.params.id, function(error, category) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was an error reading from the database'
          });
        }
        // Category found, update it
        if (category) {
          // For each property sent in the body
          Object.keys(req.body).forEach(function(property) {
            // Update the document
            category[property] = req.body[property];

          });
          // Save the updated category
          category.save(function(error) {
            // Parse any error and pass on to user
            if (error) {
              return parseError(res, error);
            }
            // Category updated, return success message
            return res.json({
              success: true,
              message: 'Category created successfully',
              entry: category
            });
          });
        }
        // Failed, no document with specified ID
        return res.json({
          success: false,
          message: 'Category does not exist',
        });
      });
    },

    // Delete specified category
    destroy: function(req, res) {
      // Find category to delete
      Categories.findByIdAndRemove(req.params.id, function(error, category) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was an error reading from the database'
          });
        }
        // Category deleted, return success message
        if (category) {
          return res.json({
            success: true,
            message: 'Category deleted successfully'
          });
        }
        // Failed, no document with specified ID
        return res.json({
          success: false,
          message: 'Category does not exist',
        });
      });
    }
  };
})();
