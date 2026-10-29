'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('config', function () {
      return gulp
        .src('src/data/global-config.json')
        .pipe($.ngConstant({
            name: 'qorDash.config'
        }))
        // .pipe(concat.header('!function(){'))
        // .pipe(concat.footer('}();'))
        .pipe($.wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe($.uglify())
        .pipe(gulp.dest('src/app/modules/core/config/'));
  });
  gulp.task('scripts', gulp.series('config', function () {
    return gulp.src(options.src + '/app/**/*.js')
      .pipe($.angularFilesort())
      .pipe($.ngAnnotate())
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size());
  }));
};
