'use strict';


var $ = require('../../../bower_components/jquery/dist/jquery');


function Events() {
    this._events = {};
}


Events.prototype = {
    on: function (eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = new $.Callbacks();
        }

        this._events[eventName].add(callback);
    },


    removeEvent: function (eventName) {
        if (!this._events[eventName]) {
            return;
        }

        this._events[eventName] = null;
    },


    trigger: function (eventName, arg) {
        if (this._events[eventName]) {
            this._events[eventName].fire(arg);
        }
    }
};


module.exports = Events;