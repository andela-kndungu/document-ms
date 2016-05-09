(function() {
  'use strict';

  var bcrypt = require('bcrypt-nodejs');
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var Roles = require('../models/roles');


  var UserSchema = new Schema({
    username: {
      type: String,
      required: [true, 'A username must be provided'],
      unique: true
    },

    name: {
      first: {
        type: String,
        required: [true, 'A first name must be provided']
      },
      last: {
        type: String,
        required: [true, 'A last name must be provided']
      }
    },

    email: {
      type: String,
      required: [true, 'An email must be provided'],
      unique: true
    },

    password: {
      type: String,
      required: [true, 'A password must be provided']
    },

    role: {
      type: String,
      required: [true, 'A role must be provided'],
      ref: 'Roles'
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

  // Helper function to hash plain text passwords
  var hashPassword = function(plainPassword, callback) {
    bcrypt.hash(plainPassword, null, null, function(error, hashedPassword) {
      if (error) {
        var err = new Error('something went wrong');
        callback(err);
      } else {
        callback(null, hashedPassword);
      }
    });
  };

  // Helper function to get role's object id
  var stringToObjectId = function(roleString, callback) {
    Roles.findOne({
      'title': roleString
    }, function(error, role) {
      if (error) {
        callback(error);
      } else {
        callback(null, role);
      }
    });
  };

  UserSchema.pre('save', function(next) {
    // To be able to access the user object from within the bcrypt function
    var user = this;
    // First check whether a valid role has been given
    stringToObjectId(user.role, function(error, role) {
      if (error) {
        next(error);
      } else {
        if (role) {
          // Replace the role string with its corresponding object id
          user.role = role._id;
        }

        // Then hash the password
        hashPassword(user.password, function(error, hashedPassword) {
          if (error) {
            next(error);
          } else {
            user.password = hashedPassword;
            next();
          }
        });
      }
    });
  });

  // Validate hashed password
  UserSchema.methods.validatePassword = function(providedPassword, callback) {
    // To be able to access the object from within the bcrypt function
    var user = this;
    bcrypt.compare(providedPassword, user.password, function(error, isMatch) {
      if (error) {
        return callback(error);
      }
      callback(null, isMatch);
    });
  };

  module.exports = mongoose.model('Users', UserSchema);
})();
