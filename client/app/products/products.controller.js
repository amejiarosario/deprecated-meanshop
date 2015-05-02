'use strict';

angular.module('meanstackApp')
  .controller('ProductsCtrl', function ($scope, products) {
    $scope.products = products;
  });
