exports.comingsoon = function (req, res, next) {
	var user = req.session.oauthUser;
  res.render('comingsoon', {
    viewname: '',
    resources: req.getResources('index'),
    user: user || {},
    csrf: req.session._csrf
  });
};