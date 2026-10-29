'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

module.exports = function(options) {
  gulp.task('watch', gulp.series('inject', function (done) {

    gulp.watch([options.src + '/*.html', 'bower.json'], gulp.series('inject'));
    gulp.watch(options.src + '/app/**/*.scss', gulp.series('styles'));
    gulp.watch(options.src + '/app/**/*.css', gulp.series('inject'));
    gulp.watch([
      options.src + '/app/**/*.js',
      '!' + options.src + '/app/modules/core/config/global-config.js',
      options.src + '/data/global-config.json'
    ], gulp.series('inject'));
    gulp.watch(options.src + '/app/**/*.html').on('change', browserSync.reload);
    done();
  }));
};
