/* global R */
require('../../../bower_components/rdio-api/index.js');

var $ = require('../../../bower_components/jquery/dist/jquery');
var Events = require('../Classes/Events.js');


function PlayerView() {
    var self = this;

    this._gigs = [];

    this.$playButton = $('.player-play-button');
    this.$prevButton = $('.player-prev-button');
    this.$nextButton = $('.player-next-button');

    this.$playButton.click(this.onPlayButtonClick.bind(this));
    this.$prevButton.click(this.onPrevButtonClick.bind(this));
    this.$nextButton.click(this.onNextButtonClick.bind(this));

    R.ready(function () {
        R.player.on('change:playingTrack', self.onPlayingTrackChange.bind(self));
        R.player.on('change:playState', self.onPlayStateChange.bind(self));
    });

    $.extend(this, new Events());
}


PlayerView.prototype = {

    onPlayingTrackChange: function (track) {
        this.renderTrackInfo(track);
    },


    onPlayStateChange: function(state) {
        if (state === R.player.PLAYSTATE_PLAYING || state === R.player.PLAYSTATE_BUFFERING) {
            this.renderState('pause');
        } else {
            this.renderState('play');
        }
    },


    onPrevButtonClick: function (event) {
        event.preventDefault();
        this.playPrevious();
    },


    onNextButtonClick: function (event) {
        event.preventDefault();
        this.playNext();
    },


    onPlayButtonClick: function (event) {
        event.preventDefault();
        this.togglePause();
    },


    renderTrackInfo: function (track) {
        $('.player-track-image').attr('src', track.get('icon'));
        $('.player-track-name').text(track.get('name'));
        $('.player-track-artist').text(track.get('artist'));
        $('.player-track-album').text(track.get('album'));
    },


    renderState: function (state) {
        $('.play-button').text(state);
    },


    setGigs: function (gigs) {
        var self = this;
        var deferred = $.Deferred();

        $.each(gigs, function (index, gig) {
            self._gigs[gig.trackKey] = gig;
        });

        R.ready(function () {
            $.each(gigs, function (index, gig) {
                R.player.queue.add(gig.trackKey);
            });

            R.player.queue.on('add', function(model, collection, info) {
                if (gigs.length > 5 || gigs.length == collection.length && deferred.state() != 'resolved') {
                    deferred.resolve(collection);
                }
            });
        });

        return deferred.promise();
    },


    togglePause: function () {
        R.ready(function () {
            R.player.togglePause();
        });
    },


    playNext: function () {
        R.ready(function () {
            R.player.next();
        });
    },


    playPrevious: function () {
        R.ready(function () {
            R.player.previous();
        });
    },


    play: function () {
        var source;

        R.ready(function () {
            R.player.play();
            source = R.player.playingSource();
        });

        return this._gigs[source];
    }
};


module.exports = PlayerView;