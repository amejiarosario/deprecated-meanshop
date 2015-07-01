'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var async = require('async');
var Product = require('./product.model.js');

describe('Products API', function() {
  var valid_attributes = [
    {title: 'Product1', price: 123.45 },
    {title: 'Product2', price: 678.90 }
  ];

  var invalid_attributes = [
    {title: 'invalid', price: -120 }
  ];

  var existing_product;

  beforeEach(function (done) {
    cleanAndCreateProducts(valid_attributes, function(err, results){
      if(err) done(err);
      existing_product = JSON.parse(JSON.stringify(results[0]));
      done();
    });
  });

  describe('GET /api/products', function() {

    it('should respond with empty array when NO products', function(done) {
      Product.remove(function (err) {
        if(err) done(err);

        request(app)
          .get('/api/products')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.should.eql([]);
            done();
          });
      })
    });

    it('should return a list of products', function(done) {
      request(app)
        .get('/api/products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(valid_attributes.length);
          res.body.should.containDeep(valid_attributes);
          done();
        });
    });

  });

  describe('GET /api/products/:id', function() {

    it('should return found product when exists', function(done) {
      request(app)
        .get('/api/products/' + existing_product._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql(existing_product);
          done();
        });
    });

    it('should return status 404 when product does NOT exist', function(done) {
      request(app)
        .get('/api/products/fa15e0000000000000000000')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/not found/i);
          done();
        });
    });

    it('should return status 500 when ObjectId is malformed', function(done) {
      request(app)
        .get('/api/products/123')
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/cast.*failed/i);
          done();
        });
    });

  });

  describe('POST /api/products', function() {
    it('should create a product with valid data', function() {
      request(app)
        .post('/api/products')
        .expect(201)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(valid_attributes[0])
        .end(function(err, res) {
          if(err) return done(err);
          res.body.should.containDeep(valid_attributes[0]);
        });
    });

    it('should NOT create a product with invalid data', function() {
      request(app)
        .post('/api/products')
        .expect(500)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(invalid_attributes[0])
        .end(function(err, res) {
          if(err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/validation failed/i);
        });
    });

  });

  describe('PUT /api/products/:id', function() {

    it('should update the product with valid data', function(done) {
      request(app)
        .put('/api/products/' + existing_product._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .send({title: 'valid title'})
        .end(function(err, res) {
          if(err) return done(err);
          res.body.should.have.property('title', 'valid title');
          res.body.should.have.property('price', existing_product.price);
          done();
        });
    });

    it('should NOT update with invalid data', function(done) {
      request(app)
        .put('/api/products/' + existing_product._id)
        .expect(500)
        .expect('Content-Type', /json/)
        .send({price: -999})
        .end(function(err, res) {
          if(err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/validation failed/i);
          done();
        });
    });

    it('should return status 404 when product does NOT exists', function(done) {
      request(app)
        .put('/api/products/fa15e0000000000000000000')
        .expect(404)
        .expect('Content-Type', /json/)
        .send({title: 'valid title'})
        .end(function(err, res) {
          if (err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/not found/i);
          done();
        });
    });

    it('should return status 500 when ObjectId is malformed', function(done) {
      request(app)
        .put('/api/products/123')
        .expect(500)
        .expect('Content-Type', /json/)
        .send({title: 'valid title'})
        .end(function(err, res) {
          if (err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/cast.*failed/i);
          done();
        });
    });

  });

  describe('DELETE /api/products/:id', function() {

    it('should delete an existing product', function(done) {
      request(app)
        .delete('/api/products/' + existing_product._id)
        .expect(204)
        .end(function(err, res) {
          if(err) return done(err);
          res.body.should.be.empty;
          done();
        });
    });

    it('should return status 404 when product does NOT exists', function(done) {
      request(app)
        .delete('/api/products/fa15e0000000000000000000')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/not found/i);
          done();
        });
    });

    it('should return status 500 when ObjectId is malformed', function(done) {
      request(app)
        .delete('/api/products/123')
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.error.should.not.be.empty;
          res.body.message.should.match(/cast.*failed/i);
          done();
        });
    });

  });
});

function cleanAndCreateProducts(data, callback){
  Product.remove(function(err){
    if(err) return callback(err);
    async.map(data, Product.create.bind(Product), callback);
  });
}
