var news = require('../proxy/news');

exports.overview = function(req, res, next) {
  var user = req.session.oauthUser;

  news.getNews(function(err, row) {
    if (err) {
      // TODO
      return next(err);
    }
    res.render('news', {
      viewname: "news",
      resources: req.getResources('news'),
      news: row,
      user: user || {},
      csrf: req.session._csrf
    });
  });
};

exports.single = function(req, res, next) {
  var id = req.params.id;
  var user = req.session.oauthUser;

  news.findOne(id, function(err, currentNews) {
    if (err) {
      // TOTO
      return next(err);
    }
    res.render('singlenews', {
      viewname: "news",
      resources: req.getResources('news'),
      news: currentNews,
      user: user || {},
      csrf: req.session._csrf
    });
  });
};