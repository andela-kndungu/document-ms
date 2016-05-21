(function() {
  'use strict';

  var Users = require('../../../server/models/users');
  var ownerIds = [];
  var accessBy = [
    ['public'],
    ['user'],
    ['admin']
  ];

  var generate = function() {
    var generatedDocuments = [];
    // Generate 200 documents
    for (var i = 0; i < 200; i++) {
      var ownersRandomIndex = Math
        .floor(Math.random() * ownerIds.length);
      var accessibleByIndex = Math
        .floor(Math.random() * accessBy.length);
      generatedDocuments.push({
        // Random five character string
        title: Math.random().toString().substring(2, 7),
        // Random repeats of 15 character strings
        content: (Math.random().toString().substring(2) + ' ')
          .repeat(Math.floor(Math.random() * 20 + 1)),
        // Random owner_id chosen from array of available owner_ids
        ownerId: ownerIds[ownersRandomIndex],
        accessibleBy: accessBy[accessibleByIndex],
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
      })
      .then(function() {
        callback(null, generate());
      }, function(error) {
        callback(error);
      });
  };
})();
