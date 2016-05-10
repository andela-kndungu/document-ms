// (function() {
//   'use strict';
//
//   var app = require('../../app');
//   var should = require('should');
//   var request = require('supertest');
//   var loginHelper = require('./helpers/login');
//   var seeder = require('./helpers/seeder');
//   var adminToken, adminId, userToken, userId, documentId;
//   describe('Documents', function() {
//     before(function(done) {
//       seeder(function(error, document_id) {
//         documentId = document_id;
//         if (error) {
//           throw (error);
//         } else {
//           loginHelper.admin(function(error, res) {
//             if (error) {
//               throw error;
//             } else {
//               adminToken = res.body.token;
//               adminId = res.body.entry._id;
//               loginHelper.user(function(error, res) {
//                 if (error) {
//                   throw error;
//                 } else {
//                   userToken = res.body.token;
//                   userId = res.body.entry._id;
//                 }
//                 done();
//               });
//             }
//           });
//         }
//       });
//     });
//     describe('Created document has a date', function() {
//       it('document created by admin has a date defined', function(done) {
//         request(app)
//           .post('/documents')
//           .set('x-access-token', adminToken)
//           .send({
//             title: 'Admin test document',
//             content: 'I am an admin testing out the date field',
//             owner_id: adminId,
//             category: 'business',
//             access_rights: 'private'
//           })
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             // Date arithmetic
//             var now = new Date().getTime();
//             var created = new Date(res.body.entry.created_at);
//             should.not.exist(error);
//             res.status.should.equal(200);
//             (res.body.success).should.equal(true);
//             should.exist(created);
//             (now - created).should.be.greaterThan(0);
//             done();
//           });
//       });
//       it('document created by user has a date defined', function(done) {
//         request(app)
//           .post('/documents')
//           .set('x-access-token', userToken)
//           .send({
//             title: 'Admin test document',
//             content: 'I am an admin testing out the date field',
//             owner_id: userId,
//             category: 'business',
//             access_rights: 'public'
//           })
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             // Date arithmetic
//             var now = new Date().getTime();
//             var created = new Date(res.body.entry.created_at);
//             should.not.exist(error);
//             res.status.should.equal(200);
//             (res.body.success).should.equal(true);
//             should.exist(created);
//             (now - created).should.be.greaterThan(0);
//             done();
//           });
//       });
//     });
//     describe('Returned documents are sorted by date', function() {
//       it('sorts all the documents in descending order by date', function(done) {
//         request(app)
//           .get('/documents')
//           .set('x-access-token', adminToken)
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             // For every document in the response
//             for (var i = 0; i < (res.body.length) - 1; i++) {
//               var documentCreated = new Date(res.body[i].created_at);
//               var nextDocumentCreated = new Date(res.body[i + 1].created_at);
//               // It was created after the next documcent in the array
//               (documentCreated - nextDocumentCreated).should.not.be.lessThan(0);
//             }
//             done();
//           });
//       });
//       it('sorts paginated in descending order by date', function(done) {
//         request(app)
//           .get('/documents?limit=10&page=5')
//           .set('x-access-token', adminToken)
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             // For every document in the response
//             for (var i = 0; i < (res.body.length) - 1; i++) {
//               var documentCreated = new Date(res.body[i].created_at);
//               var nextDocumentCreated = new Date(res.body[i + 1].created_at);
//               // It was created after the next documcent in the array
//               (documentCreated - nextDocumentCreated).should.not.be.lessThan(0);
//             }
//             done();
//           });
//       });
//       it('sorts limited in descending order by date', function(done) {
//         request(app)
//           .get('/documents?limit=10')
//           .set('x-access-token', adminToken)
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             // For every document in the response
//             for (var i = 0; i < (res.body.length) - 1; i++) {
//               var documentCreated = new Date(res.body[i].created_at);
//               var nextDocumentCreated = new Date(res.body[i + 1].created_at);
//               // It was created after the next documcent in the array
//               (documentCreated - nextDocumentCreated).should.not.be.lessThan(0);
//             }
//             done();
//           });
//       });
//     });
//     describe('Updates a document (PUT /documents/:id)', function() {
//       it('updates a document and returns new details', function(done) {
//         request(app)
//           .put('/documents/' + documentId)
//           .send({
//             title: 'A real title',
//             content: 'Some real content',
//           })
//           .set('x-access-token', adminToken)
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             should.not.exist(error);
//             res.status.should.equal(200);
//             res.body.success.should.equal(true);
//             (res.body.message).should.containEql('Document updated');
//             (res.body.entry.title).should.containEql('A real title');
//             (res.body.entry.content).should.containEql('Some real content');
//             done();
//           });
//       });
//     });
//     describe('Returns documents based on ID (GET /documents/<id>)', function() {
//       it('returns expected document', function(done) {
//         request(app)
//           .get('/documents/' + documentId)
//           .set('x-access-token', adminToken)
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             should.not.exist(error);
//             res.status.should.equal(200);
//             should.exist(res.body.entry.content);
//             should.exist(res.body.entry.title);
//             done();
//           });
//       });
//     });
//     describe('Deletes a document (DELETE /documents/:id)', function() {
//       it('deletes a document', function(done) {
//         request(app)
//           .delete('/documents/' + documentId)
//           .set('x-access-token', adminToken)
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             should.not.exist(error);
//             res.status.should.equal(200);
//             res.body.success.should.equal(true);
//             (res.body.message).should.containEql('Document deleted');
//             done();
//           });
//       });
//     });
//   });
// })();
