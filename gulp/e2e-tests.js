'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

module.exports = function(options) {
  // Downloads the selenium webdriver
  gulp.task('webdriver-update', $.protractor.webdriver_update);

  gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

  function runProtractor (done) {

    gulp.src(options.e2e + '/**/*.js')
      .pipe($.protractor.protractor({
        configFile: 'protractor.conf.js'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      })
      .on('end', function () {
        // Close browser sync server
        browserSync.exit();
        done();
      });
  }

  gulp.task('protractor:src', gulp.series(gulp.parallel('serve:e2e', 'webdriver-update'), runProtractor));
  gulp.task('protractor:dist', gulp.series(gulp.parallel('serve:e2e-dist', 'webdriver-update'), runProtractor));
  gulp.task('protractor', gulp.series('protractor:src'));
};
