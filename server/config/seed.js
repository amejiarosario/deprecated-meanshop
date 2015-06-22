/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Product = require('../api/product/product.model');
var User = require('../api/user/user.model');

Product.find({}).remove(function() {
  var num = 0;
  Product.create({
    title : 'Product ' + (++num),
    price : num * 100.33,
    stock : num * 3,
    description : 'This is the description of product ' + num
  }, {
    title : 'Product ' + (++num),
    price : num * 100.33,
    stock : num * 3,
    description : 'This is the description of product ' + num
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
