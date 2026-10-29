'use strict';

var assert = require('node:assert/strict');
var fs = require('node:fs');
var test = require('node:test');

test('loads jQuery before Angular so directives use its full selector API', function () {
  var html = fs.readFileSync('.tmp/serve/index.html', 'utf8');
  var jquery = html.indexOf('bower_components/jquery/dist/jquery.js');
  var angular = html.indexOf('bower_components/angular/angular.js');

  assert.ok(jquery >= 0, 'build must include jQuery');
  assert.ok(angular >= 0, 'build must include Angular');
  assert.ok(jquery < angular, 'jQuery must load before Angular selects its element implementation');
});
