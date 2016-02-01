'use strict';

var _h = require('highland'),
    _ = require('lodash'),
    getSetter = require('get-setter');

function Model(initialData, rules) {
    if (!(this instanceof Model)) {
        return new Model(initialData, rules);
    }

    this.stream = _h();
}

module.exports = Model;