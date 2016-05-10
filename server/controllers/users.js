(function() {
  'use strict';

  var jwt = require('jsonwebtoken');
  var Users = require('../models/users');
  var Documents = require('../models/documents');
  var parseError = require('./parseError');

  module.exports = {
    // Add a new user
    create: function(req, res) {
      // Declare new instance of the Users model
      var user = new Users();

      // Define values of the new object to add
      user.username = req.body.username;
      user.name.first = req.body.firstName;
      user.name.last = req.body.lastName;
      user.email = req.body.email;
      user.password = req.body.password;
      user.role = req.body.role;

      // Save the new user parsing the error if request is invalid
      user.save(function(error) {
        if (error) {
          return parseError(res, error);
        }

        // Category created, return success message
        return res.json({
          success: true,
          message: 'User created successfully',
          entry: user
        });
      });
    },

    // Handle all get requests for users
    find: {
      // Retrieve by ID
      id: function(req, res) {
        Users.findById(req.params.id, function(error, user) {
          // Inform user of errors with the database
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'There was an error reading from the database'
            });
          }

          // Success, return retrieved user with success message
          if (user) {
            return res.json({
              success: true,
              message: 'User retrieved',
              entry: user
            });
          }

          // Failed, no user with specified ID
          return res.status(404).json({
            success: false,
            message: 'User does not exist',
          });
        });
      },

      // Retrieve all users
      all: function(req, res) {
        // Get all entries in the users model
        Users.find({}, function(error, users) {
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
            message: 'Users retrieved',
            entry: users
          });
        });
      },

      // Get all documents belonging to a user
      documents: function(req, res) {
        // Get all documents with specified owner_id
        Documents.find({
          'owner_id': req.params.id
        }, function(error, documents) {
          // Inform user of errors with the database
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'There was an error reading from the database'
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

    // Update category by ID
    update: function(req, res) {
      // Get the user to update
      Users.findById(req.params.id, function(error, user) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was an error reading from the database'
          });
        }

        if (user) {
          Object.keys(req.body).forEach(function(property) {
            // Special cases for first and last names
            if (property === 'firstName') {
              user.name.first = req.body.firstName;
            } else if (property === 'lastName') {
              user.name.last = req.body.lastName;
            } else {
              user[property] = req.body[property];
            }
          });

          // Save the updated category
          user.save(function(error) {
            // Parse any error and pass on to user
            if (error) {
              return parseError(res, error);
            }

            // Category updated, return success message
            return res.json({
              success: true,
              message: 'Category created successfully',
              entry: user
            });

          });
        }

        // Failed, no document with specified ID
        return res.status(404).json({
          success: false,
          message: 'Category does not exist',
        });
      });
    },

    // Delete specified category
    destroy: function(req, res) {
      // Find user to delete
      Users.findByIdAndRemove(req.params.id, function(error, category) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was an error reading from the database'
          });
        }

        // User deleted, return success message
        if (category) {
          return res.json({
            success: true,
            message: 'User deleted successfully'
          });
        }

        // Failed, no user with specified ID
        return res.status(404).json({
          success: false,
          message: 'Category does not exist',
        });
      });
    },
    login: function(req, res) {
      // Look for user
      Users.findOne({
        username: req.body.username
      }, function(error, user) {
        // Inform user of errors with the database
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'There was an error reading from the database'
          });
        }

        // Failed, no user with specified ID
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User does not exist',
          });
        }

        // User found, verify provided password is valid
        user.validatePassword(req.body.password, function(error, isMatch) {
          if (error) {
            throw error;
          }

          if (isMatch) {
            // All's good, create a token
            var token = jwt.sign(user, process.env.SECRET_KEY, {
              expiresIn: '90 days'
            });

            // Return token and success message in JSON
            return res.json({
              success: true,
              message: 'You\'ve successfully been logged in.',
              token: token,
              entry: user
            });
          }

          // Passwords do not match
          res.status(401).json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        });
      });
    }
  };
})();
