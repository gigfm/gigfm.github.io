'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify", {
                            babelrc: "conf/.babelrc"
                        }]
                    ]
                },
                files: {
                    "./web/dist/js/GigFm.js": ["./web/src/js/GigFm.js"]
                }
            }

            , alt: {
                options: {
                    transform: [
                        ["babelify", {
                            babelrc: "conf/.babelrc"
                        }]
                    ]
                },
                files: {
                    "./web/dist/js/GigFm.js": ["./web/src/js/GigFm_alt.js"]
                }
            }
        }
    });

    grunt.registerTask('default', ['browserify:dist']);
};