/* global R */
require('../../../bower_components/rdio-api/index.js');

var $ = require('../../../bower_components/jquery/dist/jquery');
var _ = require('../../../bower_components/underscore/underscore.js');
var Events = require('../Classes/Events.js');


function PlayerView(gigs) {
    var self = this;

    this._currentGig = 0;
    this._gigs = gigs;

    this.$playButton = $('.player-play-button');
    this.$prevButton = $('.player-prev-button');
    this.$nextButton = $('.player-next-button');
    this.$thumbDownButton = $('.thumbDownButton');
    this.$thumbUpButton = $('.thumbUpButton');

    this.$playButton.click(this.onPlayButtonClick.bind(this));
    this.$prevButton.click(this.onPrevButtonClick.bind(this));
    this.$nextButton.click(this.onNextButtonClick.bind(this));
    this.$thumbUpButton.click(this.onThumbUpClick.bind(this));
    this.$thumbDownButton.click(this.onThumbDownClick.bind(this));

    R.ready(function () {
        R.player.on('change:playingTrack', self.onPlayingTrackChange.bind(self));
        R.player.on('change:playState', self.onPlayStateChange.bind(self));
    });

    $.extend(this, new Events());
}


PlayerView.prototype = {

    onPlayingTrackChange: function (track) {
        // track === null when a song ends
        if (track) {
            this.trigger('change:playing-track', track);
            this.renderTrackInfo(track);
        } else {
            this.playNext();
        }
    },


    onPlayStateChange: function (state) {
        if (state === R.player.PLAYSTATE_PLAYING || state === R.player.PLAYSTATE_BUFFERING) {
            this.setTrackPosition();
            this.renderState('pause');
        } else {
            if (this._interval) {
                clearInterval(this._interval);
            }
            this.renderState('play');
        }
    },


    onPrevButtonClick: function (event) {
        event.preventDefault();

        var self = this;
        R.ready(function () {
            if (! self.playAgain()) {
                self.playPrevious();
            }
        })

    },


    onNextButtonClick: function (event) {
        event.preventDefault();
        this.playNext();
    },


    onPlayButtonClick: function (event) {
        event.preventDefault();
        this.togglePause();
    },


    onThumbUpClick: function (event) {
        event.preventDefault();
        this.toggleThumb($(event.target));
    },


    onThumbDownClick: function (event) {
        event.preventDefault();
        this.toggleThumb($(event.target));
    },


    toggleThumb: function ($el) {
        // @todo
        $el.toggleClass('active-thumb');
    },


    setTrackPosition: function () {
        var duration;
        var position;
        var current;
        var self = this;
        var track = R.player.playingTrack();
        if (! track) {
            return
        }

        duration = track.get('duration');
        position = R.player.position();

        $('.player-current').text(this.toMinutes(position));
        $('.player-progress-current').width((position / duration * 100) + '%');
        $('.player-remaining').text('-' + this.toMinutes(duration - position));

        this._interval = setInterval(function () {
            var position = R.player.position();

            $('.player-current').text(self.toMinutes(position));
            $('.player-progress-current').width((position / duration * 100) + '%');
            $('.player-remaining').text('-' + self.toMinutes(duration - position));
        }, 1000);
    },


    renderTrackInfo: function (track) {
        $('.player-track-image').attr('src', track.get('icon'));
        $('.player-track-name').text(track.get('name'));
        $('.player-track-artist').text(track.get('artist'));
        $('.player-track-album').text(track.get('album'));

        var duration = track.get('duration');
        $('.player-end').text(this.toMinutes(duration));
    },


    toMinutes: function (seconds) {
        var minutes = Math.floor(seconds / 60);
        var secs = '0' + (seconds - (minutes * 60));
        return minutes + ':' + secs.substring(secs.length - 2);
    },


    renderState: function (state) {
        if (state === 'pause') {
            $('.playButton').css('display', 'none');
            $('.pauseButton').css('display', 'inline-block');
        } else {
            $('.playButton').css('display', 'inline-block');
            $('.pauseButton').css('display', 'none');
        }
    },


    togglePause: function () {
        R.ready(function () {
            R.player.togglePause();
        });
    },


    playGig: function (gig) {
        R.ready(function () {
            R.player.play({source: gig.trackKey});
        });

        return gig;
    },


    playTrack: function (trackKey) {
        this._currentGig = _.findIndex(this._gigs, function (gig) {
            return gig.trackKey == trackKey;
        });

        this.play();
    },


    playNext: function () {
        this._currentGig++;
        if (this._currentGig >= this._gigs.length) {
            this._currentGig = 0;
        }

        return this.play();
    },


    playAgain: function () {
        var position = R.player.position();
        if (position <= 1) {
            return false;
        }

        this.play();
        return true;
    },


    playPrevious: function () {
        this._currentGig--;
        if (this._currentGig < 0) {
            this._currentGig = this._gigs.length - 1;
        }

        return this.play();
    },


    play: function () {
        var gig = this._gigs[this._currentGig];
        return this.playGig(gig);
    }
};


module.exports = PlayerView;