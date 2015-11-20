'use strict';


var $ = require('../../bower_components/jquery/dist/jquery');

require('../../lib/rdio-utils/rdio-utils.js');

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
        var location = new Location();

        location.getLocation().done(this.onGetLocation.bind(this));
    } else {
        alert('Location information is not available.');
    }
}


GigFm.prototype = {
    onGetLocation: function (loc) {
        var api = new Api();

        api.getTracksByLocation(loc.lat, loc.long)
            .done(this.onApiSuccess.bind(this))
            .fail(this.onApiFail.bind(this));
    },


    onApiSuccess: function (response) {
        var playerView;
        var moreGigsView;

        this.view = new GigFmView();

        if (response && $.isArray(response)) {
            playerView = this.playerView = new PlayerView(response);
            moreGigsView = this.moreGigsView = new MoreGigsView(response);
            this.venueView = new VenueView(response);

            playerView.on('change:playing-track', this.onPlayingTrackChange.bind(this));
            moreGigsView.on('request:play-track', this.onPlayTrackRequest.bind(this));

            playerView.play();
        } else {
            alert('Invalid data from gigFm.');
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