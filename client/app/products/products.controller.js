'use strict';

angular.module('meanstackApp')
  .controller('ProductsCtrl', function ($scope, Products) {
    $scope.products = Products.query();
  })

  .controller('ProductViewCtrl', function ($scope, $state, $stateParams, Products) {
    $scope.product = Products.get({id: $stateParams.id});
    $scope.deleteProduct = function(product){
      Products.delete({id: $scope.product._id}, function (value, responseHeaders) {
          $state.go('products');
      }, errorHandler($scope));
    }
  })

  .controller('ProductNewCtrl', function ($scope, $state, Products) {
    $scope.product = {}; // create a new instance
    $scope.addProduct = function(){
      Products.save($scope.product, function(value, responseHeaders){
        $state.go('viewProduct', {id: value._id});
      }, errorHandler($scope));
    }
  })

  .controller('ProductEditCtrl', function ($scope, $state, $stateParams, Products) {
    $scope.product = Products.get({id: $stateParams.id});
    $scope.editProduct = function(){
      Products.update({id: $scope.product._id}, $scope.product, function(value, responseHeaders){
        $state.go('viewProduct', {id: value._id});
      }, errorHandler($scope));
    }
  });

function errorHandler(scope){
  return function(httpResponse){
    scope.errors = JSON.stringify(httpResponse);
  }
}
