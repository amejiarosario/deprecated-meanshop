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

      .state('newProduct', {
        url: '/products/new',
        templateUrl: 'app/products/product-new.html',
        controller: 'ProductNewCtrl'
      })

      .state('editProduct', {
        url: '/products/:id/edit',
        templateUrl: 'app/products/product-edit.html',
        controller: 'ProductEditCtrl'
      })

      .state('checkout', {
        url: '/checkout',
        templateUrl: 'app/products/products-checkout.html',
        controller: 'ProductCheckoutCtrl'
      });
  });
