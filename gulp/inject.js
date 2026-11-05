'use strict'

var gulp = require('gulp')
var patchInstalledBootstrap = require('../build/patch-bootstrap.cjs').patchInstalledBootstrap

var $ = require('gulp-load-plugins')()

var wiredep = require('wiredep').stream

module.exports = function (options) {
  gulp.task(
    'inject',
    gulp.series(patchInstalledBootstrap, gulp.parallel('scripts', 'styles'), function () {
      var injectStyles = gulp.src(
        [options.tmp + '/serve/app/**/*.css', '!' + options.tmp + '/serve/app/vendor.css'],
        { read: false }
      )

      var injectScripts = gulp
        .src([
          options.src + '/app/**/*.js',
          '!' + options.src + '/app/**/*.spec.js',
          '!' + options.src + '/app/**/*.mock.js'
        ])
        .pipe($.angularFilesort())

      var injectOptions = {
        ignorePath: [options.src, options.tmp + '/serve'],
        addRootSlash: false
      }

      return gulp
        .src(options.src + '/*.html')
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(options.wiredep))
        .pipe(gulp.dest(options.tmp + '/serve'))
    })
  )
}
