'use strict';

angular.module('meanstackApp')
  .controller('ProductsCtrl', function ($scope, Products) {
    $scope.products = Products.query();
  })

  .controller('ProductViewCtrl', function ($scope, $state, $stateParams, Products) {
    $scope.product = Products.get({id: $stateParams.id});

    $scope.deleteProduct = function(product){
      Products.delete(product);
      $state.go('products');
    }
  })

  .controller('ProductNewCtrl', function ($scope, $state, Products) {
    $scope.product = {}; // create a new instance
    $scope.addProduct = function(product){
      Products.create($scope.product);
      $state.go('products');
    }
  })

  .controller('ProductEditCtrl', function ($scope, $state, $stateParams, Products) {
    $scope.product = Products.get({id: $stateParams.id});

    $scope.editProduct = function(product){
      Products.update($scope.product);
      $state.go('products');
    }
  });
