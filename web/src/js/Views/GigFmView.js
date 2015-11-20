'use strict';


/* global R */
require('../../../bower_components/rdio-api/index.js');

var $ = require('../../../bower_components/jquery/dist/jquery');

function GigFmView() {
    $('.showArtistinfo').click(function(){
        $('.albumArt').toggleClass('close');
        $('.showArtistinfo').toggleClass('collapseDown');
        $('#artistBio').toggleClass('open');
    });

    $('.viewMoregigs').click(function(){
        $('#contentWrapper').toggleClass('close');
        $('.viewMoregigs').toggleClass('collapseDown');
        $('#relatedGigs').toggleClass('open');
    });
}


GigFmView.prototype = {
    render: function () {
        R.ready(function () {
            var firstname;
            var playingTrack = R.player.playingTrack();
            var currentUser = R.currentUser;

            if (! (playingTrack || currentUser)) {
                return;
            }

            firstname = currentUser.get('firstName');
            if (!firstname) {
                firstname = 'there fancy pants';
            }

            $('.personal-message-listener').text(firstname);
            $('.personal-message-artist').text(playingTrack.get('artist'));
        });
    }
};


module.exports = GigFmView;