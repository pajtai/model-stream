'use strict';

var _h = require('highland');

function Model(initialData) {
    if (! (this instanceof Model)) {
        return new Model(initialData);
    }

    this.stream = _h();
    this.stream.write(initialData);
}

Model.prototype.update = update;

module.exports = Model;

function update(data) {
    this.stream.write(data);
    return this;
}
