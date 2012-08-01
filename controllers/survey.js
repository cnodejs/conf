var topic = require('../proxy/topic');

exports.speakers = function (req, res, next) {
  var user = req.session.oauthUser;
  topic.getFormalTopics(function (err, row) {
    if (err) {
      // TODO
      next(err);
      return;
    }
    res.render('speakers', {
      viewname: 'speakers',
      resources: req.getResources('speakers'),
      foreign: row.filter(function (topic) {
        return topic.type === "formal" && topic.language === "english";
      }).sort(function (a, b) {
        return b.vote.length - a.vote.length;
      }),
      local: row.filter(function (topic) {
        return topic.type === "formal" && topic.language !== "english";
      }).sort(function (a, b) {
        return b.vote.length - a.vote.length;
      }),
      user: user || {},
      csrf: req.session._csrf
    });
  });
};

exports.inviteTopics = function (req, res, next) {
  var user = req.session.oauthUser;
  topic.getInviteTopics(function (err, row) {
    if (err) {
      // TODO
      next(err);
      return;
    }
    res.render('survey', {
      viewname: 'survey',
      resources: req.getResources('survey'),
      topics: row.sort(function (a, b) {
        return b.vote.length - a.vote.length;
      }),
      user: user || {},
      csrf: req.session._csrf
    });
  });
};

exports.vote = function (req, res) {
  var user = req.session.oauthUser;

  var id = req.body.id;
  var who = user.name;
  topic.plus(id, who, function (err, record) {
    if (err) {
      // TODO
      res.send({'status': 'fail', 'message': 'unauthorized'}, 500);
      return;
    }
    res.send({'status': 'success', 'vote': record.vote.length});
  });
};

/**
 * {name: "", speaker: "", vote: [], type: "formal|wish"}
 */
exports.addTopic = function (req, res) {
  var user = req.session.oauthUser;

  var post = req.body;
  var doc = {
    name: post.name,
    speaker: post.speaker,
    vote: [user.name],
    type: "wish"
  };

  topic.addTopic(doc, function (err, topics) {
    if (err) {
      res.send({'status': 'fail', 'message': 'unauthorized'}, 500);
      return;
    }
    res.send({'status': 'success', 'topics': topics});
  });
};
