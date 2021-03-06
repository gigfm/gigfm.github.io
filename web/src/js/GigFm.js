'use strict';


var $ = require('../../bower_components/jquery/dist/jquery');
window.jQuery = $;

require('../../lib/rdio-utils/rdio-utils.js');
require('../../bower_components/bootstrap/dist/js/npm');

// Classes
var Api = require('./Classes/Api.js');
var Location = require('./Classes/Location.js');

// Views
var GigFmView = require('./Views/GigFmView.js');
var VenueView = require('./Views/VenueView.js');
var MoreGigsView = require('./Views/MoreGigsView.js');
var PlayerView = require('./Views/PlayerView.js');


function GigFm() {
    if ('geolocation' in navigator) {
        var location = this.location = new Location();

        location.getLocation().done(this.onGetLocation.bind(this));
    } else {
        alert('Location information is not available.');
    }
}


GigFm.prototype = {
    onGetLocation: function (loc) {
        this.setLocation(loc.lat, loc.long);
    },


    setLocation: function (lat, long) {
        var api = new Api();
        var $currentLocation = $('.current-location');

        api.getTracksByLocation(lat, long)
            .done(this.onApiSuccess.bind(this))
            .fail(this.onApiFail.bind(this));

        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json', {
            latlng: lat + ',' + long
        }).done(function (response) {
            if (response && response.results) {
                var location = response.results[3].address_components[0].long_name;
                $currentLocation.text(location);
            }
        });
    },


    onApiSuccess: function (response) {
        this.view = new GigFmView();

        if (response && $.isArray(response)) {
            this.playerView = new PlayerView(response);
            this.moreGigsView = new MoreGigsView(response);
            this.moreGigsView.init(response);

            if (! this.venueView) {
                this.venueView = new VenueView(response);
            } else {
                this.venueView.init(response);
            }

            this.playerView.off('change:playing-track').on('change:playing-track', this.onPlayingTrackChange.bind(this));
            this.moreGigsView.off('change:location').on('change:location', this.onLocationChange.bind(this));
            this.moreGigsView.off('request:play-track').on('request:play-track', this.onPlayTrackRequest.bind(this));

            this.playerView.play();
        } else {
            alert('Invalid data from gigFm.');
        }
    },


    onLocationChange: function (lat, long) {
        if (!lat || !long) {
            this.location.getLocation().done(this.onGetLocation.bind(this));
        } else {
            this.setLocation(lat, long);
        }
    },


    onPlayingTrackChange: function (track) {
        this.view.render();
        this.venueView.render(track);
    },


    onPlayTrackRequest: function (trackKey) {
        this.playerView.playTrack(trackKey);
    },


    onApiFail: function () {
        alert('Failed fetching data from gigFm.');
    }
};


module.exports = GigFm;