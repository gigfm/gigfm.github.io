var $ = require('../../../bower_components/jquery/dist/jquery');


function Location () {
    this.options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
}


Location.prototype = {
    getLocation: function () {
        this._deferred = new $.Deferred();

        navigator.geolocation.getCurrentPosition(this.onGetCurrentPosition.bind(this), this.onGetCurrentPositionFail.bind(this), this.options);

        return this._deferred.promise();
    }


    , onGetCurrentPosition: function (pos) {
        var crd = pos.coords;

        this._deferred.resolve({
            lat: crd.latitude
            , long: crd.longitude
            , accuracy: crd.accuracy
        });
    }


    , onGetCurrentPositionFail: function () {
        // FAIL!!
    }
};


module.exports = Location;