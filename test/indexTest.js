'use strict';

var Model = require('../index'),
    _h = require('highland'),
    chai = require('chai');

chai.should();

describe('model stream', function() {
    describe('set', function() {
        describe('simple non stream', function() {
            it('should be able to set and get simply using dot notation', function() {
                var model = Model();

                model.set('a.b.c', 'alphabet');

                model.get('a.b.c').should.equal('alphabet');
            });
        });

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
                    meta : {
                        validation: {
                            validated: false,
                            valid: false,
                            errors: []
                        }
                    }
                });
                done();
            });
        });

        xit('should set vaildated to false after any set');
        xit('should be able to set multiple values by passing in an array');
        xit('should be able to skip validation by setting options.validate to false');
    });

    describe('validate', function() {
        it('should be able to set validation rules for keys that return an error string if not valid', function(done) {
            var model = new Model({
                user : {
                    name : {
                        first : '',
                        last : ''
                    }
                }
            });

            model.rules({
                'user.name.first' : validateName
            });

            function validateName(name) {
                // name cannot begin with number
                if (/^\d/.test(name)) {
                    return 'Sorry, numbers are not allowed as the first character of a name.';
                }
            }

            model.set('user.name.first', '8 too much, Sr. III Esquire');
            model.validate();

            model.stream.pull(function(err, state) {
                state.meta.validation.valid.should.equal(false);
                state.meta.validation.errors.should.deep.equal([
                    ['user.name.first', 'Sorry, numbers are not allowed as the first character of a name.']
                ]);
                done();
            });
        });

        xit('should be able to validate collections (arrays)');
        xit('should be able to support async validations via streams');
    });

    describe('examples', function() {
        describe('validation', function() {

        });
    });
});
