var topic = require('../proxy/topic');

exports.topics = function (req, res, next) {
  var user = req.session.oauthUser;
  topic.getTopics(function (err, row) {
    if (err) {
      // TODO
      next(err);
      return;
    }
    res.render('admin', {
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

exports.updateTopic = function (req, res, next) {
  var post = req.body;
  var update = {};
  if (post.type) {
    update.type = post.type;
  }
  if (post.name) {
    update.name = post.name;
  }
  if (post.speaker) {
    update.speaker = post.speaker;
  }
  topic.changeTopic(post.id, update, function (err) {
    if (err) {
      next(err);
      return;
    }
    res.send({"status": "success"});
  });
};

exports.viewTopic = function (req, res, next) {
  var get = req.query;
  var id = get.id;
  topic.findOne(id, function (err, record) {
    if (err) {
      next(err);
      return;
    }
    res.send({"status": "success", "topic": record});
  });
};