'use strict'

var assert = require('node:assert/strict')
var fs = require('node:fs')
var test = require('node:test')

test('loads jQuery before Angular so directives use its full selector API', function () {
  var html = fs.readFileSync('.tmp/serve/index.html', 'utf8')
  var jquery = html.indexOf('bower_components/jquery/dist/jquery.js')
  var angular = html.indexOf('bower_components/angular/angular.js')

  assert.ok(jquery >= 0, 'build must include jQuery')
  assert.ok(angular >= 0, 'build must include Angular')
  assert.ok(jquery < angular, 'jQuery must load before Angular selects its element implementation')
})

test('copies binary fonts without changing their contents', function () {
  var fonts = require('main-bower-files')().filter(function (file) {
    return /\.(ttf|woff|woff2)$/.test(file)
  })
  assert.ok(fonts.length > 0, 'the template must include fonts')
  fonts.forEach(function (file) {
    var output = 'dist/fonts/' + require('node:path').basename(file)
    assert.deepEqual(fs.readFileSync(output), fs.readFileSync(file), output)
  })
})

test('caches templates at their application URLs', function () {
  var cache = fs.readFileSync('.tmp/partials/templateCacheHtml.js', 'utf8')
  assert.ok(cache.includes('app/modules/auth/login.html'))
  assert.ok(!cache.includes('app/app/modules/'))
})

test('bundled styles do not reference unavailable Bower files', function () {
  var styles = fs.readdirSync('dist/styles').filter(function (file) {
    return file.endsWith('.css')
  })
  assert.ok(styles.length > 0)
  styles.forEach(function (file) {
    assert.ok(!fs.readFileSync('dist/styles/' + file, 'utf8').includes('bower_components'), file)
  })
})

test('Bootstrap glyphicons are copied and every local CSS URL resolves', function () {
  var path = require('node:path')
  var source = 'bower_components/bootstrap-sass/assets/fonts/bootstrap'
  fs.readdirSync(source).forEach(function (file) {
    assert.deepEqual(fs.readFileSync('dist/fonts/' + file), fs.readFileSync(source + '/' + file))
  })
  fs.readdirSync('dist/styles')
    .filter(function (file) {
      return file.endsWith('.css')
    })
    .forEach(function (file) {
      var css = fs.readFileSync('dist/styles/' + file, 'utf8')
      for (var match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        var url = match[1].split(/[?#]/)[0]
        if (!url.startsWith('http') && !url.startsWith('data:')) {
          assert.ok(fs.statSync(path.resolve('dist/styles', url)).size > 0, url)
        }
      }
    })
})
