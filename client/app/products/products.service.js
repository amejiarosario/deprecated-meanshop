'use strict';

angular.module('meanstackApp')
  .factory('Products', function ($resource) {
    return $resource('/api/products/:id', null, {
      'get':    { method:'GET' },
      'save':   { method:'POST' },
      'query':  { method:'GET', isArray:true },
      'remove': { method:'DELETE' },
      'delete': { method:'DELETE' },
      'update': { method: 'PUT' }
    });
  });
