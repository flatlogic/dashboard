'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      throw err;
    };
  },
  wiredep: {
    directory: 'bower_components',
    exclude: [/bootstrap-sass-official\/.*\.js/, /bootstrap\.css/]
  }
};

['scripts', 'styles', 'inject', 'watch', 'build', 'server', 'e2e-tests', 'unit-tests', 'deploy'].forEach(function(task) {
  require('./gulp/' + task)(options);
});

gulp.task('default', gulp.series('clean', 'build'));
