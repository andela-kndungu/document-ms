(function() {
  'use strict';

  var app = require('../../app');
  var should = require('should');
  var request = require('supertest');
  var loginHelper = require('./helpers/login');
  var seeder = require('./helpers/seeder');
  var adminToken;
  describe('Categories', function() {
    before(function(done) {
      seeder(function(error) {
        if (error) {
          throw(error);
        } else {
          loginHelper.admin(function(error, res) {
            if (error) {
              throw error;
            } else {
              adminToken = res.body.token;
            }
            done();
          });
        }
      });
    });
    describe('Returns all categories', function() {
      xit('responds with an array of all categories', function(done) {
        request(app)
          .get('/categories')
          .set('x-access-token', adminToken)
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.body.should.be.an.Array;
            should(res.body.length).be.exactly(2);
            done();
          });
      });
    });
    describe('Creates a new category', function() {
      it('successfully creates a new category', function(done) {
        request(app)
          .post('/categories')
          .set('x-access-token', adminToken)
          .send({
            title: 'chores'
          })
          .set('Accept', 'application/json')
          .end(function(error, res) {
            should.not.exist(error);
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            (res.body.message).should.containEql('Category created successfully');
            done();
          });
      });
    });
  });
})();
