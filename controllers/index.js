var topic = require('../proxy/topic');
exports.index = function (req, res, next) {
  var user = req.session.oauthUser /* Weibo */ || req.user /* Twitter or Github */;
  topic.getTopics(function (err, row) {
    if (err) {
      // TODO
      next(err);
      return;
    }
    res.render('index', {
      resources: req.getResources('index'),
      formal: row.filter(function (topic) {
        return topic.type === "formal";
      }),
      wish: row.filter(function (topic) {
        return topic.type === "wish";
      }),
      user: user || {},
      csrf: req.session._csrf,
      layout: false
    });
  });
};
