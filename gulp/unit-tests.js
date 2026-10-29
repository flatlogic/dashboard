'use strict';

var gulp = require('gulp');
var karma = require('karma');

module.exports = function(options) {

  function runTests (singleRun, done) {
      var server = new karma.Server({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: singleRun,
        autoWatch: !singleRun
      }, function(exitCode) {
        if (exitCode !== 0) {
          done(new Error('Karma exited with code ' + exitCode));
          return;
        }
        done();
      });
      server.start();
  }

  gulp.task('test', gulp.series('scripts', function (done) {
    runTests(true, done);
  }));
  gulp.task('test:auto', gulp.series('watch', function (done) {
    runTests(false, done);
  }));
};
