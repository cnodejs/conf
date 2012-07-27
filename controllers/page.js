var pages = require('../proxy/page');

exports.view = function(req, res, next) {
  var sign = req.params.sign;
  var user = req.session.oauthUser;

  pages.findOne(sign, function(err, page) {
    if (err) {
      // TOTO
      return next(err);
    }
    res.render('page', {
      resources: req.getResources('index'),
      page: page,
      user: user || {},
      csrf: req.session._csrf,
      layout: false
    });
  });
};