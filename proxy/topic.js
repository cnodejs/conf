var config = require('../config');
var mongo = require('mongoskin');
var db = mongo.db(config.db);

var topics = db.collection('topics');

exports.getTopics = function (callback) {
  topics.find().toArray(callback);
};

exports.plus = function (id, who, callback) {
  topics.findAndModify({
      _id: mongo.ObjectID.createFromHexString(id)
    },
    [['_id','asc']],
    {$addToSet: {vote: who}},
    {'new': true},
    callback
  );
};

exports.addTopic = function (topic, callback) {
  topics.insert(topic, callback);
};
