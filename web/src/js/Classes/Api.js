'use strict';


var $ = require('../../../bower_components/jquery/dist/jquery');


function Api() {
    this.url = '//gigfmapp.herokuapp.com/api/getTracks';
}


Api.prototype = {
    getTracksByLocation: function (lat, long) {
        var data = {
            lat: lat,
            long: long,
            popsort: 't'
        };

        return $.getJSON(this.url, data);
    }
};


module.exports = Api;