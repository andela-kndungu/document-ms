(function() {
  'use strict';

  var app = require('../../app');
  var should = require('should');
  var request = require('supertest');
  var loginHelper = require('./helpers/login');
  var seeder = require('./helpers/seeder');
  var adminToken, adminId;
  describe('Search', function() {
    before(function(done) {
      seeder(function(error) {
        if (error) {
          throw (error);
        } else {
          loginHelper.admin(function(error, res) {
            if (error) {
              throw error;
            } else {
              adminToken = res.body.token;
              adminId = res.body.entry._id;
              done();
            }
          });
        }
      });
    });
    describe('Search by role', function() {
      xit('returns all doucments accessible by the admin', function(done) {
        request(app)
          .get('/documents/search?role=admin')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            (res.body).should.be.an.Array;
            res.status.should.equal(200);
            should(res.body.length).be.greaterThan(0);
            done();
          });
      });
      xit('returns all doucments accessible by the user', function(done) {
        request(app)
          .get('/documents/search?role=user')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            (res.body).should.be.an.Array;
            should(res.body.length).be.greaterThan(0);
            done();
          });
      });
      xit('admin\'s returned doucments are sorted by date', function(done) {
        request(app)
          .get('/documents/search?role=admin')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            // For every document in the response
            for (var i = 0; i < (res.body.length) - 1; i++) {
              var currentDocument = new Date(res.body[i].created);
              var nextDocument = new Date(res.body[i + 1].created);
              // It was created after the next documcent in the array
              (currentDocument - nextDocument).should.not.be.lessThan(0);
            }
            done();
          });
      });
      xit('user\'s returned doucments are sorted by date', function(done) {
        request(app)
          .get('/documents/search?role=user')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            // For every document in the response
            for (var i = 0; i < (res.body.length) - 1; i++) {
              var currentDocument = new Date(res.body[i].created_at);
              var nextDocument = new Date(res.body[i + 1].created_at);
              // It was created after the next documcent in the array
              (currentDocument - nextDocument).should.not.be.lessThan(0);
            }
            done();
          });
      });
      xit('number of returned doucments can be specified', function(done) {
        request(app)
          .get('/documents/search?role=admin&&limit=10')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should(res.body.length).not.be.greaterThan(10);
            done();
          });
      });
    });
    describe('search by date', function() {
      xit('returns public documents created on a specific date', function(done) {
        var today = new Date();
        var year = today.getUTCFullYear();
        var month = parseInt(today.getUTCMonth() + 1, 10) < 10 ?
          '0' + (today.getUTCMonth() + 1) :
          today.getMonth() + 1;
        var day = parseInt(today.getUTCDate(), 10) < 10 ?
          '0' + today.getUTCDate() :
          today.getDate();
        // var day = today.getDate();
        var dateString = year + '-' + month + '-' + day;
        request(app)
          .get('/documents/search?date=' + dateString)
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            res.status.should.equal(200);
            should(res.body.length).be.greaterThan(0);
            done();
          });
      });
      xit('no documents are returned for an invalid date', function(done) {
        var today = new Date();
        var year = today.getFullYear();
        var month = parseInt(today.getMonth() + 2, 10) < 10 ?
          '0' + (today.getMonth() + 2) :
          today.getMonth() + 2;
        var day = parseInt(today.getDate(), 10) < 10 ?
          '0' + today.getDate() :
          today.getDate();
        var dateString = year + '-' + month + '-' + day;
        request(app)
          .get('/documents/search?date=' + dateString)
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            res.status.should.equal(200);
            should(res.body.length).be.exactly(0);
            done();
          });
      });
    });
  });
})();
