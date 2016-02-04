'use strict';

var _h = require('highland'),
    _ = require('lodash'),
    getSetter = require('get-setter'),
    staticMethods = require('./static');

Model.only = {
    data : staticMethods.dataOnly,
    key : staticMethods.keyOnly
};

// Click through to the methods for comments
Model.prototype.set = set;
Model.prototype.get = get;
Model.prototype.getState = getState;
Model.prototype.rules = rules;
Model.prototype.validate = validate;

module.exports = Model;

function Model(initialData) {
    if (!(this instanceof Model)) {
        return new Model(initialData, rules);
    }

    this._data = initialData || {};
    this._rules = {};
    this._meta = {
        validation : {
            validated : false,
            valid : false,
            errors : []
        }
    };

    this._lastSet = '';

    this.stream = _h();
    this.stream.write(this.getState());

    // just being explicit
    return this;
}

/**
 *
 * @param key
 * @param value
 * @returns {set}
 */
function set(key, value) {
    getSetter.set.call(this._data, key, value);
    this._lastSet = key;
    this.stream.write(this.getState());
    return this;
}

function get(key) {
    return getSetter.get.call(this._data, key);
}

/**
 * Gets the current data and meta data.
 * The metadata inclused all filterable properties.
 * The data is the raw data object.
 * @returns {{}}
 */
function getState() {
    return {
        set : this._lastSet,
        meta : this._meta,
        data : this._data
    };
}

/**
 * Define the validation rules as an object.
 * The keys are the dot notation getters
 * The values are callbacks that will get called with the model value. They should return and error string if there is
 * an error, and they should return falsey if not.
 * When the rules are called, they are called with the model as context.
 * @param ruleSet
 * @returns {rules}
 */
function rules(ruleSet) {
    _.extend(this._rules, ruleSet);
    return this;
}

/**
 * Will run the rules that were passed in via model.rules.
 * Listen to model.stream for updates.
 * @returns {validate}
 */
function validate() {
    var errors = [],
        self = this;

    _.forEach(this._rules, function(rule, key) {
        var errorString = rule.call(self, self.get(key));
        if (errorString && errorString.length) {
            errors.push([key, errorString]);
        }
    });

    if (errors.length) {
        this._meta.validation = {
            validated : true,
            valid : false,
            errors : errors
        }
    } else {
        this._meta.validation = {
            validated: false,
            valid: true,
            errors: []
        }
    }
    return this;
}