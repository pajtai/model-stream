'use strict';

var Model = require('../index'),
    _h = require('highland'),
    chai = require('chai');

chai.should();

describe('model stream', function() {
    describe('set', function() {

        it('initialization adds to the stream', function(done) {
            var stream = Model({
                a : 1
            }).stream;

            stream.pull(function(err, data) {
                data.should.deep.equal({
                    data : {
                        a : 1
                    },
                    set : '',
                    valid : {
                        validated : false,
                        valid : true,
                        errors : []
                    }
                });
                done();
            });
        });
    });
});
