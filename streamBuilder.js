'use strict';

var _h = require('highland');

StreamBuilder.prototype.data = data;
StreamBuilder.prototype.key = key;

module.exports = StreamBuilder;

function StreamBuilder(model) {
    this._stream = model._stream;
    return this;
}

function data() {
    var self = this;
    return new StreamBuilder({
        _stream : self._stream.map(dataOnly)
    });
}

function key(keyIn) {
    var self = this;
    return new StreamBuilder({
        _stream : self._stream.filter(filterToKey(keyIn))
    });
}

function filterToKey(subscribedKey) {
    return function(fullData) {
        return filterKeysOfInterest(fullData.set, subscribedKey);
    }
}

function dataOnly(fullData) {
    return fullData.data;
}

function filterKeysOfInterest(changedPath, subscribedKey) {

    var startsWith,
        contains,
        hit = false;

    // Need to add a root level element to deal with ''
    changedPath = changedPath ? 'data.' + changedPath : 'data';
    subscribedKey = subscribedKey ? 'data.' + subscribedKey : 'data';

    // using [.] vs \\. for readability
    startsWith = new RegExp('^' + subscribedKey + '[.]');
    contains = new RegExp('^' + changedPath + '[.]');

    // Notify if sub path is included in changed path
    if (startsWith.test(changedPath)) {
        hit = true;
    } else if (subscribedKey === changedPath) {
        hit = true;
    } else if (contains.test(subscribedKey)) {
        hit = true;
    }

    return hit;
}