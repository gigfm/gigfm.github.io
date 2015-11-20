require('../../lib/modernizr.touch.js');
var $ = require('../../bower_components/jquery/dist/jquery');
var _ = require('../../bower_components/underscore/underscore.js');
require('../../lib/rdio-utils/rdio-utils.js');

// Classes
var Api = require('./Classes/Api.js');
var Location = require('./Classes/Location.js');

// Views
var GigFmView = require('./Views/GigFmView.js');
var VenueView = require('./Views/VenueView.js');
var MoreGigsView = require('./Views/MoreGigsView.js');
var PlayerView = require('./Views/PlayerView.js');

function GigFm () {
    this.view = new GigFmView();

    if ("geolocation" in navigator) {
        var location = new Location();
        location.getLocation().done(this.onGetLocation.bind(this));
    } else {
        alert('Location information is not available');
    }

    R.ready(function () {
        R.player.on('change:playingSource', function () {
            console.log(111);
        });

        R.player.on('change:playingTrack', function () {
            console.log(222);
        });

        R.player.on('change:playState', function () {
            console.log(333);
        });
    });
}


GigFm.prototype = {
    onGetLocation: function (loc) {
        var api = new Api();

        var l =  api.getTracksByLocation(loc.lat, loc.long)
            .done(this.onApiSuccess)
            .fail(this.onApiFail);
    }


    , onApiSuccess: function (response) {
        var gig;
        var playerView = this.PlayerView = new PlayerView();
        var moreGigsView = this.MoreGigsView = new MoreGigsView();
        var venueView = this.VenueView = new VenueView();

        if (response && $.isArray(response)) {
            moreGigsView.render(response);

            playerView.setGigs(response).done(function () {
                gig = playerView.play();
                venueView.render(gig);
            });
        } else {
            // The response object is improperly formatted
        }
    }


    , onApiFail: function (response) {
        // HTTP ERROR
    }
};

window.GigFm = GigFm;