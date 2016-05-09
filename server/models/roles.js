(function() {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var RoleSchema = new Schema({
    title: {
      type: String,
      required: [true, 'A role title must be provided'],
      unique: true
    },
  });

  module.exports = mongoose.model('Roles', RoleSchema);
})();
