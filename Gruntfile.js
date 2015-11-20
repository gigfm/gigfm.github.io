'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        browserify: {
            dist: {
                options: {
                    transform: [
                        ['babelify', {
                            babelrc: 'conf/.babelrc'
                        }]
                    ]
                },
                files: {
                    './web/dist/js/app.js': ['./web/src/js/app.js']
                }
            }
        },


        eslint: {
            options: {
                configFile: 'conf/.eslintrc'
            },
            target: ['web/src/js/**/*.js']
        }
    });

    grunt.registerTask('default', ['browserify:dist']);
    grunt.registerTask('test', ['eslint']);
};