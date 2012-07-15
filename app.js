var express = require('express');
var i18n = require('connect-i18n');
var ejs = require('ejs');

var resources = require('./resources');

var app = express.createServer();
app.use("/assets", express.static(__dirname + "/assets"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(i18n());
app.use(function (req, res, next) {
  resources.setLocale(req.locales[0]);
  req.resources = resources;
  next();
});
// 用于网络监控
app.get('/status', function (req, res, next) {
  res.json({status: 'success', now: new Date()});
});
app.get('/', function (req, res) {
  res.render('index', {resources: req.resources});
});
app.listen(80);
