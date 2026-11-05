'use strict';
var annotate = require('ng-annotate-patched');
var through = require('through2');
module.exports = function () {
  return through.obj(function (file, encoding, done) {
    var result = annotate(file.contents.toString(), {add: true, single_quotes: true});
    if (result.errors) {
      done(new Error(result.errors.join('\n')));
      return;
    }
    file.contents = Buffer.from(result.src);
    done(null, file);
  });
};
