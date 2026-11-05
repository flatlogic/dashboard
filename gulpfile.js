'use strict';

var gulp = require('gulp');

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      console.error('[' + title + ']', err.toString());
      throw err;
    };
  },
  wiredep: {
    directory: 'bower_components',
    overrides: {
      angular: {
        dependencies: { jquery: '*' }
      }
    },
    exclude: [/bootstrap-sass-official\/.*\.js/, /bootstrap\.css/]
  }
};

['scripts', 'styles', 'inject', 'watch', 'build', 'server', 'unit-tests', 'deploy'].forEach(function(task) {
  require('./gulp/' + task)(options);
});

gulp.task('default', gulp.series('build'));
