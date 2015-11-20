var $ = require('../../../bower_components/jquery/dist/jquery');
var _ = require('../../../bower_components/underscore/underscore.js');
var Events = require('../Classes/Events.js');
var Mustache = require('../../../bower_components/mustache.js/mustache.js');


function MoreGigsView(gigs) {
    var self = this;

    this.init(gigs);

    R.ready(this.onReady.bind(this));
    $.extend(this, new Events());

    $('.change-location').off('click').click(function (event) {
        event.preventDefault();
        var latlong = $(event.target).data('latlong');

        if (typeof latlong == 'string') {
            latlong = latlong.split(',');
            self.trigger('change:location', latlong[0], latlong[1]);
        } else {
            self.trigger('change:location');
        }

        $('#changeLocationModal').modal('hide');
    });
}


MoreGigsView.prototype = {

    init: function (gigs) {
        var tracks  = {};
        this.template = $('#gig-template').html();
        Mustache.parse(this.template);

        _.each(gigs, function (gig) {
            tracks[gig.trackKey] = {
                gig: gig
            };
        });
        this._tracks = tracks;
    },


    render: function (num) {
        var self = this;
        var divArray = [];

        _.some(this._tracks, function (track) {
            var div = Mustache.render(self.template, {
                image_url: track.info.icon
                , artist: track.info.artist
                , track_key: track.gig.trackKey
                , ticket_url: track.gig.ticketUrl
            });

            var $div = $(div);
            $('.gig-play-artist-link', $div).click(self.onPlayArtistClick.bind(self));

            divArray.push($div);
            return num && divArray.length >= num;
        });

        return $('.gigsWrapper').html(divArray);
    }


    , loadTrackInfo: function () {
        var trackKeys = _.keys(this._tracks);

        R.request({
            method: 'get',
            content: {
                keys: trackKeys
            },
            success: this.onTrackInfoLoad.bind(this),
            error: this.onTrackInfoLoadError.bind(this)
        });
    }


    , onTrackInfoLoad: function (response) {
        var self = this;
        var tracks = response.result;

        _.each(tracks, function (info, key) {
            self._tracks[key].info = info;
        });

        this.render(8);
    }


    , onTrackInfoLoadError: function (response) {
        alert('Error loading track info: ' + response.message);
    }


    , onPlayArtistClick: function (event) {
        event.preventDefault();

        var trackKey = $(event.target).data('trackKey');
        if (! trackKey) {
            trackKey = $(event.currentTarget).data('trackKey');
        }

        this.trigger('request:play-track', trackKey);
    }


    , onReady: function () {
        this.loadTrackInfo()
    }


    , setGigs: function (gigs) {
        this._gigs = gigs;
        this.loadTrackInfo(gigs);
    }
};


module.exports = MoreGigsView;