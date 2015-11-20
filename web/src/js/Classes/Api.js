'use strict';


var $ = require('../../../bower_components/jquery/dist/jquery');


function Api() {
    // this.url = '//gigfmapp.herokuapp.com/api/getTracks';
    this.url = 'data.json';
}


Api.prototype = {
    getTracksByLocation: function (lat, long) {
        var data = {
            lat: lat,
            long: long
        };

        return $.getJSON(this.url, data);
    }
};


module.exports = Api;