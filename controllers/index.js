var topic = require('../proxy/topic');

exports.index = function (req, res, next) {
  var user = req.session.oauthUser;
  res.render('index', {
    viewname: 'home',
    resources: req.getResources('index'),
    user: user || {},
    csrf: req.session._csrf
  });
};
