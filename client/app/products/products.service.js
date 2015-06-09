'use strict';

angular.module('meanstackApp')
  .factory('Products', function ($resource) {
    return $resource('/api/products/:id', null, {
      'update': { method: 'PUT'}
    });
  });
