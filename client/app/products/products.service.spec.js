'use strict';

var Products, $httpBackend,
    valid_attributes = [
      {title: 'Product1', price: 123.45 },
      {title: 'Product2', price: 678.90 }
    ],
    newAttributes = {title: 'Product3', price: 1000 },
    productWithId = angular.extend({}, newAttributes, {id: 123});

describe('Service: Products', function () {
  beforeEach(module('meanstackApp'));
  beforeEach(inject(function (_Products_, _$httpBackend_) {
    Products = _Products_;
    $httpBackend = _$httpBackend_;

    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  }));

  afterEach(function() {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('index - list products', function() {
    it('should fetch products with HTTP GET request', function() {
      $httpBackend.expectGET('/api/products').respond(valid_attributes);
      Products.query(function (products) {
        expect(products).toEqualData(valid_attributes);
      });
    });

    it('should work with empty data', function () {
      $httpBackend.expectGET('/api/products').respond([]);
      Products.query(function (products) {
        expect(products).toEqualData([]);
      });
    });
  });

  describe('show - get a product', function() {
    it('should get a single product by id', function() {
      $httpBackend
        .expectGET('/api/products/1')
        .respond(valid_attributes[0]);
      Products.get({id: 1}, function(product){
        expect(product).toEqualData(valid_attributes[0]);
      });
    });

    itShouldHandleNotFoundWith('get');
  });

  describe('create - new product creation', function() {
    beforeEach(function() {
      $httpBackend
        .expect('POST', '/api/products', JSON.stringify(newAttributes))
        .respond(productWithId);
    });

    it('should create a new Product from the class', function() {
      var newProduct = Products.save(newAttributes,
        successCb(productWithId));

      expect(newProduct).toEqualData(newAttributes);
    });

    it('should create a new product from the instance', function() {
      var product = new Products();
      product.title = 'Product3';
      product.price = 1000;

      product.$save(successCb(productWithId));

      expect(product).toEqualData(newAttributes);
    });
  });

  describe('update - changes products attributes', function() {
    var updated_values = {title: 'new title', price: 987};

    it('should update attributes with PUT', function() {
      $httpBackend
        .expectPUT('/api/products/123', updated_values)
        .respond(angular.extend({}, updated_values, {id: 123}));

      Products.update({id: 123}, updated_values, function(product){
        expect(product.id).toBe(123);
        expect(product.price).toBe(987);
        expect(product.title).toBe('new title');
      });
    });

    itShouldHandleNotFoundWith('put', 'update');
  });

  describe('delete - remove products', function() {
    it('should delete product', function() {
      $httpBackend
        .expectDELETE('/api/products/123')
        .respond({});
      Products.remove({id: 123}, successCb);
    });

    itShouldHandleNotFoundWith('delete');
  });
});

function successCb(match){
  return function(value, responseHeaders){
    expect(value).toEqualData(match);
  }
}

function itShouldHandleNotFoundWith(verb, fnName){
  return it('should return `not found` when ' + verb.toUpperCase() +
    ' /api/products/:id does not exist', function() {
    $httpBackend
      .expect(verb.toUpperCase(), '/api/products/999')
      .respond(404, 'not found');

    Products[fnName || verb.toLowerCase()]({id: 999}, {}, successCb, function fail(err) {
      expect(err.status).toBe(404);
      expect(err.data).toBe('not found');
    });
  });
}


