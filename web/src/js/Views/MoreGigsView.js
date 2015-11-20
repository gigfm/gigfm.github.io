var $ = require('../../../bower_components/jquery/dist/jquery');
var _ = require('../../../bower_components/underscore/underscore.js');

function MoreGigsView() {

}


MoreGigsView.prototype = {
    render: function (data) {
        var htmlArray = _.map(data, function (trackData) {
            return '';
        });

        htmlArray.unshift('<ul class="more-gigs-list">');
        htmlArray.push('</ul>');

        return $('.more-gigs').html(htmlArray.join(''));
    }
};


module.exports = MoreGigsView;