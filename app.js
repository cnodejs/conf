var express = require('express');
var i18n = require('connect-i18n');
var ejs = require('ejs');
var Localize = require('localize');
var weibo = require('weibo');
var config = require('./config');

// Controllers
var index = require('./controllers/index');
var survey = require('./controllers/survey');
var status = require('./controllers/status');
var admin = require('./controllers/admin');

var app = express.createServer();
app.use(express.cookieParser('hujs_conf_keyboard_cat'));
app.use(express.session({cookie: {maxAge: 20 * 60000}}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.csrf());

weibo.init('weibo', config.weibo.appkey, config.weibo.secret);
weibo.init('tqq', config.tqq.appkey, config.tqq.secret);
weibo.init('github', config.github.appkey, config.github.secret);

app.use(weibo.oauth({
  blogtypeField: "blogtype"
}));

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

var authRequired = function (req, res, next) {
  var user = req.session.oauthUser;
  if (!user) {
    var accept = req.headers.accept || '';
    if (~accept.indexOf('json')) {
      res.send({'status': 'fail', 'message': 'unauthorized'}, 401);
    } else {
      res.redirect('/');
    }
    return;
  }
  next();
};

var adminRequired = function (req, res, next) {
  var user = req.session.oauthUser;
  if (user.t_url === "http://weibo.com/shyvo") {
    next();
  } else {
    res.send({'status': 'fail', 'message': 'unauthorized'}, 401);
  }
};

app.post('/add_topic', authRequired, survey.addTopic);
app.post('/vote_topic', authRequired, survey.vote);
app.get('/admin/topics', authRequired, adminRequired, admin.topics);
app.post('/admin/update_topic', authRequired, adminRequired, admin.updateTopic);
app.get('/admin/view_topic', authRequired, adminRequired, admin.viewTopic);

// 用于网络监控
app.get('/status', status.status);
app.get('/', index.index);
app.listen(process.argv[2] || 80);
