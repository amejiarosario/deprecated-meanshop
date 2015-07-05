'use strict';

function callCallbackWithError(err, obj){
  return function(/* arguments */){
    // last argument is always the callback
    var callback = arguments[arguments.length-1];
    callback(err, obj);
  };
}

var controller, scope, Products, state, mockProduct,
    validAttributes = [
      {id: 1, title: 'Product 1', price: 100.10 },
      {id: 2, title: 'Product 2', price: 200.20 },
    ];

describe('Controller: ProductsCtrl', function () {
  beforeEach(module('meanstackApp'));
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    Products = jasmine.createSpyObj('Products',
      ['get', 'save', 'query', 'remove', 'delete', 'update']
    );
    state = jasmine.createSpyObj('state', ['go']);
    mockProduct = validAttributes[0];
    Products.get.andReturn(mockProduct);
    Products.query.andReturn(validAttributes);
  }));

  describe('ProductsCtrl', function() {
    beforeEach(inject(function ($controller) {
      controller = $controller('ProductsCtrl', {
        $scope: scope,
        Products: Products
      });
    }));

    it('should get all the products', function() {
      expect(scope.products).toBe(validAttributes);
    });
  });

  describe('ProductViewCtrl', function() {
    beforeEach(inject(function ($controller) {
      controller = $controller('ProductViewCtrl', {
        $scope: scope,
        Products: Products,
        $state: state,
      });
    }));

    it('should get a single product', function() {
      expect(scope.product).toBe(mockProduct);
    });

    it('should remove product and redirect if succeded', function() {
      Products.delete.andCallFake(callCallbackWithError(false));
      scope.deleteProduct(mockProduct);
      expect(Products.delete).toHaveBeenCalledWith(
        { id: mockProduct.id },
        jasmine.any(Function)
      );
      expect(state.go).toHaveBeenCalledWith('products');
    });

    it('should not redirect if an error occurs', function() {
      Products.delete.andCallFake(callCallbackWithError(true));
      scope.deleteProduct(mockProduct);
      expect(state.go).not.toHaveBeenCalled();
    });
  });

  describe('ProductNewCtrl', function() {
    beforeEach(inject(function ($controller) {
      controller = $controller('ProductNewCtrl', {
        $scope: scope,
        Products: Products,
        $state: state,
      });
    }));

    it('should create a new product and redirect to products', function() {
      Products.save.andCallFake(callCallbackWithError(false, mockProduct));
      scope.addProduct(mockProduct);
      expect(Products.save).toHaveBeenCalledWith(
        mockProduct,
        jasmine.any(Function)
      );
      expect(state.go).toHaveBeenCalledWith('products/' + mockProduct.id);
    });

    it('should not redirect if save fails', function() {
      Products.save.andCallFake(callCallbackWithError(true));
      scope.addProduct(mockProduct);
      expect(state.go).not.toHaveBeenCalled();
    });
  });

  describe('ProductEditCtrl', function() {
    beforeEach(inject(function ($controller) {
      controller = $controller('ProductEditCtrl', {
        $scope: scope,
        Products: Products,
        $state: state,
      });
    }));

    it('should get the product', function() {
      expect(scope.product).toBe(mockProduct);
    });

    it('should edit product and redirect to view if success', function() {
      Products.update.andCallFake(callCallbackWithError(false, mockProduct));
      scope.editProduct(mockProduct);
      expect(state.go).toHaveBeenCalledWith('products/' + mockProduct.id);
    });

    it('should not redirect if failed', function() {
      Products.update.andCallFake(callCallbackWithError(true, mockProduct));
      scope.editProduct(mockProduct);
      expect(state.go).not.toHaveBeenCalled();
    });
  });
});
