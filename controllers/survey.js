var topic = require('../proxy/topic');

exports.vote = function (req, res) {
  var user = req.session.oauthUser || req.user;

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
  var user = req.session.oauthUser || req.user;

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
