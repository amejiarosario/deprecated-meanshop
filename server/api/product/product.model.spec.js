'use strict';

var Product = require('./product.model.js');
var utils = require('../../components/utils');

describe('Product Search', function () {
  beforeEach(function (done) {
    utils.createProductsCatalog(done);
  });

  it('should find 1 product with _corolla_ word', function(done) {
    Product.search('corolla', function (err, data) {
      console.error(err);
      // array of finded results
      console.log(data.results);
      // count of all matching objects
      console.log(data.totalCount);
      done(err);
    })
  });

});

xdescribe('Product', function() {
  beforeEach(function(done){
    Product.remove(done); // remove all data
  });

  after(function(done){
    Product.remove(done); // remove all data
  });

  it('should not create without title', function(done) {
    Product.create({price: 123.45}, function(err){
      err.should.not.be.empty();
      done();
    });
  });

  it('should remove trailing spaces from title', function(done){
    Product.create({title: '  no space  ', price: 123},
      productShouldHave('title', 'no space', done));
  });

  it('should default stock to 1', function(done){
    Product.create({title: 'title', price: 123},
      productShouldHave('stock', 1, done));
  });

  it('should not create without price', function(done) {
    Product.create({title: 'no price'}, function(err){
      err.should.not.be.empty();
      done();
    });
  });

  it('should not allow negative price', function(done) {
    Product.create({title: 'title', price: -123}, function(err){
      err.should.not.be.empty();
      done();
    });
  });

  it('should save a description', function(done){
    Product.create({title: 'title', price: 123, description: 'le description'},
      productShouldHave('description', 'le description', done));
  });
});

function productShouldHave(name, value, done){
  return function(err){
    if(err) done(err);

    Product.findOne({}, function(err, product){
      if(err) done(err);
      product.should.have.property(name, value);
      done();
    });
  }
}
