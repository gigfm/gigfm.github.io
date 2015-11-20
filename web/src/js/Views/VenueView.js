'use strict';


var $ = require('../../../bower_components/jquery/dist/jquery');
var _ = require('../../../bower_components/underscore/underscore.js');


function VenueView(gigs) {
    this._gigs = gigs;
}


VenueView.prototype = {
    render: function (track) {
        var trackKey = track.get('key');
        var gig = _.find(this._gigs, function (_gig) {
            return trackKey === _gig.trackKey;
        });

        $('.venue-artist-name').text(gig.artistName);
        $('.venue-show-date').text(gig.eventDate);
        $('.venue-show-time').text(gig.eventTime);
        $('.venue-name').text(gig.venueName);
        $('.venue-show-location').text(gig.venueCity);
        $('.venue-buy-tickets-link').attr('href', gig.ticketUrl);
    }
};


module.exports = VenueView;