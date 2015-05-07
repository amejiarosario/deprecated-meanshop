'use strict';

angular.module('meanstackApp')
  .controller('ProductsCtrl', function ($scope, Products) {
    $scope.products = Products.query();
  })

  .controller('ProductViewCtrl', function ($scope, $stateParams, Products) {
    $scope.product = Products.get({id: $stateParams.id});
    console.log($scope.product);
  });
