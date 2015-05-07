'use strict';

angular.module('meanstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('products', {
        url: '/products',
        templateUrl: 'app/products/products.html',
        controller: 'ProductsCtrl'
      })

      .state('viewProduct', {
        url: '/products/:id',
        templateUrl: 'app/products/product-view.html',
        controller: 'ProductViewCtrl'
      })

      });
  });
