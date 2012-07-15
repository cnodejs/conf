var express = require('express');
var i18n = require('connect-i18n');
var ejs = require('ejs');

var resources = require('./resources');

var app = express.createServer();
app.use("/assets", express.static(__dirname + "/assets"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(i18n());
// app.use();
app.use(function (req, res, next) {
  resources.setLocale(req.locales[0]);
  next();
});
app.get('/', function (req, res) {
  res.render('index', {resources: resources});
});
app.listen(80);
