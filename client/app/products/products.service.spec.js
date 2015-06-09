'use strict';

describe('Service: Products', function () {

  // load the service's module
  beforeEach(module('meanstackApp'));

  var Products,
      $httpBackend,
      valid_attributes = [
        {title: 'Product1', price: 123.45 },
        {title: 'Product2', price: 678.90 }
      ];
  var newAttributes = {title: 'Product3', price: 1000 };
  var productWithId = angular.extend({}, newAttributes, {id: 123});

  // instantiate service
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
  });

  describe('index - list products', function() {

    it('should fetch products with HTTP GET request', function() {
      $httpBackend.expectGET('/api/products').respond(valid_attributes);
      Products.query(function (products) {
        expect(products).toEqualData(valid_attributes);
      });
    });
  });

  describe('show - get a product', function() {

    it('should get a single product by :id', function() {
      $httpBackend
        .expectGET('/api/products/1')
        .respond(valid_attributes[0]);
      Products.get({id: 1}, function(product){
        expect(product).toEqualData(valid_attributes[0]);
      });
    });
  });

  describe('create - new product creation', function() {

    beforeEach(function() {
      $httpBackend
        .expect('POST', '/api/products', JSON.stringify(newAttributes))
        .respond(productWithId);
    });

    it('should create a new Product from the class', function() {
      var newProduct = Products.save(newAttributes,
        successCallback(productWithId),
        errorCallback);

      expect(newProduct).toEqualData(newAttributes);
    });

    it('should create a new product from the instance', function() {
      var product = new Products();
      product.title = 'Product3';
      product.price = 1000;

      product.$save(successCallback(productWithId), errorCallback);

      expect(product).toEqualData(newAttributes);
    });
  });

  describe('update - changes products attributes', function() {
    it('should update attributes with PUT', function() {
      var updated_values = {title: 'new title', price: 987};

      $httpBackend
        .expectPUT('/api/products/123', updated_values)
        .respond(angular.extend({}, updated_values, {id: 123}));

      Products.update({id: 123}, updated_values, function(product){
        expect(product.id).toBe(123);
        expect(product.price).toBe(987);
        expect(product.title).toBe('new title');
      });
    });
  });

  describe('delete - remove products', function() {
    it('should delete product', function() {
      $httpBackend
        .expectDELETE('/api/products/123')
        .respond({});
      Products.remove({id: 123}, successCallback({}));
    });

    it('should invoke error callback if not found', function() {
      $httpBackend
        .expectDELETE('/api/products/4123')
        .respond(404, 'presource not found');
      Products.remove({id: 4123}, function(err, data){
        expect(err.status).toBe(1404);
        expect(err.data).toBe('presource not found');
      });
    });
  });
});

function successCallback(match){
  return function(data, err){
    expect(data).toEqualData(match);
  }
}

function errorCallback(msg){
  return function(err){
    expect(err).toBe(msg);
  }
};

