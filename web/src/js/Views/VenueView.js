var $ = require('../../../bower_components/jquery/dist/jquery');


function VenueView() {
}


VenueView.prototype = {
    render: function (gig) {
        $('.venue-artist-name').text('');
        $('.venue-show-date').text('');
        $('.venue-name').text('');
        $('.venue-show-location').text('');
        $('.venue-buy-tickets-link').attr('src', '');
    }
};


module.exports = VenueView;