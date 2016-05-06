(function() {
  'use strict';

  var Users = require('../../../server/models/users');
  var Roles = require('../../../server/models/roles');
  var Categories = require('../../../server/models/categories');
  var Documents = require('../../../server/models/documents');
  var seeds = require('./seedData');
  var generateDocuments = require('./generateDocuments');
  // Redefine the return value of Model.create to be a promise
  var mongoose = require('mongoose');
  mongoose.Model.seed = function(insertArray) {
    var promise = new mongoose.Promise();
    this.create(insertArray, function(error) {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    return promise;
  };

  module.exports = function(callback) {
    // Reset collections
    Users.remove().exec()
      .then(function() {
        return Roles.remove().exec();
      })
      .then(function() {
        return Categories.remove().exec();
      })

    // Seed data
    .then(function() {
        return Roles.seed(
          seeds.roles);
      })
      .then(function() {
        return Users.seed(
          seeds.users);
      })
      .then(function() {
        return Categories.seed(
          seeds.categories);
      })
      .then(function() {
        generateDocuments(function(error, documents) {
          if (error) {
            console.log(error);
            throw error;
          } else {
            return Documents.seed(documents);
          }
        }); 
      })

    // Finish up
    .then(function() {
      console.log('Data successfully seeded');
      callback(null);
    }, function(error) {
      callback(error);
    });
  };


})();
