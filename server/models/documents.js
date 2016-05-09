(function() {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var Users = require('../models/users');
  var Categories = require('../models/categories');

  var DocumentsSchema = new Schema({
    owner_id: {
      type: String,
      required: [true, 'An owner id must be provided'],
    },
    title: {
      type: String,
      required: [true, 'A title must be provided'],
    },
    content: {
      type: String,
      required: [true, 'Some content must be provided']
    },
    category: {
      type: String,
      required: [true, 'A category must be provided'],
      ref: 'Categories'
    },
    role_of_creator: {
      type: String,
    },
    access_rights: {
      type: String,
      enum: ['private', 'public'],
      required: [true, 'An access right must be provided']
    },
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

  // To enable searching of documents by role
  DocumentsSchema.pre('save', function(next) {
    var document = this;
    Users.findById(document.owner_id)
      .populate('role')
      .exec(function(error, user) {
        if (user) {
          document.role_of_creator = user.role.title;
        }
        Categories.find({
            'title': document.category
          },
          function(error, category) {
            if (error) {
              throw error;
            }
            if (category[0]) {
              document.category = category[0]._id;
            }
            next();
          });


      });
  });

  module.exports = mongoose.model('Documents', DocumentsSchema);
})();
