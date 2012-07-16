var express = require('express');
var i18n = require('connect-i18n');
var ejs = require('ejs');
var Localize = require('localize');

var app = express.createServer();
app.use("/assets", express.static(__dirname + "/assets"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(i18n());
app.use(function (req, res, next) {
  if (['en-us', 'zh-cn'].indexOf(req.locales[0]) === -1) {
    req.locales[0] = 'en-us';
  }
  req.getResources = function (viewname) {
    var localize = new Localize(require('./resources')[viewname]);
    localize.setLocale(this.locales[0]);
    return localize;
  };
  next();
});
// 用于网络监控
app.get('/status', function (req, res, next) {
  res.json({status: 'success', now: new Date()});
});
app.get('/', function (req, res) {
  res.render('home', {resources: req.getResources('home')});
});
app.listen(80);
