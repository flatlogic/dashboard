'use strict';

var gulp = require('gulp');
var karma = require('karma');

module.exports = function(options) {

  function runTests (singleRun, done) {
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: singleRun,
        autoWatch: !singleRun
      }, done);
  }

  gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
  });
  gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
  });
};
