'use strict';
var gulp = require('gulp');
var publish = require('gh-pages').publish;
module.exports = function () {
  gulp.task('deploy', gulp.series('build', function (done) {
    publish('dist', done);
  }));
};
