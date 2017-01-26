var express = require('express');
var app = express();
var fs = require('fs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/v1/domain', function (req, res) {
  res.json(require('./domains.json'));
});

app.get('/v1/dockerapi/:domain/:class', function (req, res) {
  res.json(require('./dockerapi.json'));
});

app.get('/docker/:domain/:class/:ip/info', function (req, res) {
  res.json(require('./dockerInfo.json'));
});

app.get('/docker/:domain/:class/:ip/info', function (req, res) {
  res.json(require('./dockerInfo.json'));
});

app.get('/v1/pkg/:domain', function(req, res){
  res.json(require('./pkg.json'));
});

app.get('/v1/env/:domain', function(req, res){
  res.json(require('./pkg.json'));
});

app.get('/v1/conf/:domain', function(req, res){
  res.json(require('./conf.json'));
});

app.get('/v1/env/:domain/:inf/:adinf', function(req, res){
  res.json(require('./envresp.json'));
});

app.get('/v1/pkg/:domain/:inf/:adinf', function(req, res){
  res.json(require('./envresp.json'));
});

app.get('/v1/orchestrate/:domain/:serv', function(req, res) {
  res.json(require('./orchestrate.json'));
})

app.get('/v1/conf/:domain/:info/:adinfo/:file', function(req, res) {
  fs.readFile(__dirname + '/nginx.conf', function(err, contents) {
    console.log(err, contents)
    res.send(contents);
  });
});

app.get('/v1/domain/:id', function (req, res) {
  require('./instances.json').map(function(instance) {
    if (instance.id == req.params.id) {
      res.json(instance);
    }
  });
});

app.listen(8080, function () {
  console.log('Example app listening on port 3000!')
});