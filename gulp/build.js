'use strict';

var gulp = require('gulp');
var fs = require('node:fs/promises');
var path = require('node:path');
var htmlmin = require('gulp-html-minifier-terser');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files']
});

module.exports = function(options) {
  gulp.task('partials', function () {
    return gulp.src([
      options.src + '/app/**/*.html',
      options.tmp + '/serve/app/**/*.html'
    ])
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'qorDash',
        base: path.resolve(options.src)
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
  });

  gulp.task('html', gulp.series(gulp.parallel('inject', 'partials'), function () {
    var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: options.tmp + '/partials',
      addRootSlash: false
    };

    var htmlFilter = $.filter('*.html', {restore: true, dot: true});
    var jsFilter = $.filter('**/*.js', {restore: true, dot: true});
      //var jsCodemirrorFilter = $.filter('codemirror/mode/**/*.js', {restore: true, dot: true});
    var cssFilter = $.filter('**/*.css', {restore: true, dot: true});
    var assetsFilter = $.filter(['**/*.js', '**/*.css'], {restore: true, dot: true});

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe($.useref())
      .pipe(assetsFilter)
      .pipe($.rev())
      .pipe(jsFilter)
        //.pipe(jsCodemirrorFilter)
      .pipe(require('./annotate')())
      .pipe($.uglify({ output: { comments: /^!|@license|@preserve|@cc_on/i } })).on('error', options.errorHandler('Uglify'))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe($.replace(/(?:\.\.\/)+bower_components\/(?:bootstrap-sass\/assets\/fonts\/bootstrap|font-awesome\/fonts)\//g, '../fonts/'))
      .pipe($.replace('../bower_components/select2/', '../assets/select2/'))
      .pipe($.csso())
      .pipe(cssFilter.restore)
      .pipe(assetsFilter.restore)
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(htmlFilter.restore)
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));
  }));

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles(), {encoding: false})
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}', {dot: true}))
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/fonts/'));
  });

  gulp.task('other', function () {
    return gulp.src([
      options.src + '/**/*',
      '!' + options.src + '/**/*.{html,css,js,scss}'
    ], {encoding: false})
      .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task('clean', async function () {
    await Promise.all([options.dist, options.tmp].map(function (folder) {
      return fs.rm(folder, {recursive: true, force: true});
    }));
  });

  gulp.task('select2-assets', function () {
    return gulp.src('bower_components/select2/*.{png,gif}', {encoding: false})
      .pipe(gulp.dest(options.dist + '/assets/select2/'));
  });

  gulp.task('build', gulp.series('clean', gulp.parallel('html', 'fonts', 'other', 'select2-assets')));
};
