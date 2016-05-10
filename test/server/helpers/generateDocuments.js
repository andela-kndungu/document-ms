(function() {
  'use strict';

  var Users = require('../../../server/models/users');
  var Categories = require('../../../server/models/categories');
  var ownerIds = [];
  var categoriesArray = [];
  var accessRightsArray = ['private', 'public'];

  var generate = function() {
    var generatedDocuments = [];
    // Generate 200 documents
    for (var i = 0; i < 200; i++) {
      var ownersRandomIndex = Math
        .floor(Math.random() * ownerIds.length);
      var categoriesRandomIndex = Math
        .floor(Math.random() * categoriesArray.length);
      var accessRightsRandomIndex = Math
        .floor(Math.random() * accessRightsArray.length);
      generatedDocuments.push({
        // Random five character string
        title: Math.random().toString().substring(2, 7),
        // Random repeats of 15 character strings
        content: (Math.random().toString().substring(2) + ' ')
          .repeat(Math.floor(Math.random() * 20 + 1)),
        // Random owner_id chosen from array of available owner_ids
        owner_id: ownerIds[ownersRandomIndex],
        category: categoriesArray[categoriesRandomIndex],
        access_rights: accessRightsArray[accessRightsRandomIndex]
      });
    }
    return generatedDocuments;
  };

  module.exports = function(callback) {
    Users.find().exec(function(error, users) {
        if (error) {
          console.log(error);
          throw error;
        } else {
          users.forEach(function(user) {
            ownerIds.push(user._id);
          });
        }
      }).then(function() {
        return Categories.find().exec(function(error, categories) {
          if (error) {
            console.log(error);
            throw (error);
          } else {
            categories.forEach(function(category) {
              categoriesArray.push(category.title);
            });
          }
        });
      })
      .then(function() {
        callback(null, generate());
      }, function(error) {
        callback(error);
      });
  };
})();
