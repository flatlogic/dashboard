'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var util = require('util');

var middleware = require('./proxy');

module.exports = function(options) {

  function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components',
        '/data': 'data'
      };
    }

    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      startPath: '/',
      server: server,
      single: true,
      browser: browser
    });
  }

  gulp.task('serve', gulp.series('watch', function (done) {
    browserSyncInit([options.tmp + '/serve', options.src]);
    done();
  }));

  gulp.task('serve:dist', gulp.series('build', function (done) {
    browserSyncInit(options.dist);
    done();
  }));

  gulp.task('serve:e2e', gulp.series('inject', function (done) {
    browserSyncInit([options.tmp + '/serve', options.src], []);
    done();
  }));

  gulp.task('serve:e2e-dist', gulp.series('build', function (done) {
    browserSyncInit(options.dist, []);
    done();
  }));
};
