// (function() {
//   'use strict';
//
//   var app = require('../../app');
//   var should = require('should');
//   var request = require('supertest');
//   var loginHelper = require('./helpers/login');
//   var seeder = require('./helpers/seeder');
//   var adminToken;
//   describe('Roles', function() {
//     before(function(done) {
//       seeder(function(error) {
//         if (error) {
//           throw(error);
//         } else {
//           loginHelper.admin(function(error, res) {
//             if (error) {
//               throw error;
//             } else {
//               adminToken = res.body.token;
//             }
//             done();
//           });
//         }
//       });
//     });
//     describe('Returns all roles', function() {
//       it('responds with an array of all roles', function(done) {
//         request(app)
//           .get('/roles')
//           .set('x-access-token', adminToken)
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             should.not.exist(error);
//             res.body.should.be.an.Array;
//             should(res.body.length).be.exactly(2);
//             done();
//           });
//       });
//     });
//     describe('Creates a new role', function() {
//       it('successfully creates a new role', function(done) {
//         request(app)
//           .post('/roles')
//           .set('x-access-token', adminToken)
//           .send({
//             title: 'viewer'
//           })
//           .set('Accept', 'application/json')
//           .end(function(error, res) {
//             should.not.exist(error);
//             res.status.should.equal(200);
//             res.body.success.should.equal(true);
//             (res.body.message).should.containEql('Role created successfully');
//             done();
//           });
//       });
//     });
//   });
// })();
