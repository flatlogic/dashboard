// Karma configuration
// Generated on Thu Sep 24 2015 12:21:31 GMT+0300 (Беларусь (зима))

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-ui-layout/ui-layout.js',
            'bower_components/angular-relative-date/angular-relative-date.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-ui-codemirror/ui-codemirror.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-ui-notification/src/angular-ui-notification.js',
            'bower_components/angular-bootstrap-confirm/dist/angular-bootstrap-confirm.js',
            'bower_components/oboe/dist/oboe-browser.js',
            'bower_components/angular-xeditable/dist/js/xeditable.js',
            'bower_components/angular-oboe/dist/angular-oboe.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-diff-match-patch/*.js',
            'bower_components/Chart.js/Chart.min.js',
            'bower_components/angular-chart.js/angular-chart.js',
            'bower_components/jasmine-jquery/lib/*.js',
            'src/app/index.js',
            'src/app/**/*.module.js',
            'src/app/**/*.js',
            'src/app/**/*.spec.js',
            {pattern: 'src/data/*.json', included: false},
            {pattern: 'src/app/**/*.html', included: false},
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
          'src/app/**/!(*spec).js': ['coverage']
        },

        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        proxies: {
            "/data/": "http://localhost:9876/base/src/data/",
            "/app/": "http://localhost:9876/base/src/app/"
        }
    })
};
