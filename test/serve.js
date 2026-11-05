'use strict';
var express = require('express');
var app = express();
app.use(express.static('dist'));
app.listen(4322, '127.0.0.1');
