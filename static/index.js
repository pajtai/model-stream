'use strict';

var _h = require('highland');

module.exports = {
    dataOnly : _h.map(dataOnly),
    keyOnly : keyOnly
};

function dataOnly(fullData) {
    return fullData.data;
}

function keyOnly(key, stream) {
    return stream.filter(function filterToKey(fullData) {
        return notifySubscriber(fullData.set, key);
    });
}

function notifySubscriber(changedPath, subscribedKey) {

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