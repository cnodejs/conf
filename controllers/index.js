var topic = require('../proxy/topic');

exports.index = function (req, res, next) {
  var user = req.session.oauthUser;
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
      }).sort(function (a, b) {
        return b.vote.length - a.vote.length;
      }),
      wish: row.filter(function (topic) {
        return topic.type === "wish";
      }).sort(function (a, b) {
        return b.vote.length - a.vote.length;
      }),
      user: user || {},
      csrf: req.session._csrf,
      layout: false
    });
  });
};
