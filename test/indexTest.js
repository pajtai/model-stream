'use strict';

var Model = require('../index'),
    chai = require('chai');

chai.should();

describe('model stream', function() {

    describe('model data', function() {

        it('should be able to access initial value from Model.stream', function(done) {

            Model({ a: 1 })
                .stream
                .each(function(obj) {
                    obj.should.deep.equal({ a: 1});
                    done();
                });
        });

        it('should be able to update model data using Model.update', function(done) {
            var model = Model({ a: 1 });

            model.update({ b: 1 });

            model.stream.pull(function(err, obj) {
                obj.should.deep.equal({ a : 1 });
            });

            model.stream.pull(function(err, obj) {
                obj.should.deep.equal({ b : 1 });
                done();
            });
        })
    });
});