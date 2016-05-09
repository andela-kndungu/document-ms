(function() {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var CategorySchema = new Schema({
    title: {
      type: String,
      required: [true, 'A category title must be provided'],
      unique: true
    },
  });

  module.exports = mongoose.model('Categories', CategorySchema);
})();
