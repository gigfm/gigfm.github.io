/* global R */
require('../../../bower_components/rdio-api/index.js');

var $ = require('../../../bower_components/jquery/dist/jquery');

function GigFmView() {
    R.ready(function () {
        $('.username').text(R.currentUser.get('firstName'));
    });
}


module.exports = GigFmView;