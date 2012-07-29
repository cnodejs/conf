var config = require('../config');
var mongo = require('mongoskin');
var db = mongo.db(config.db);

var topics = db.collection('topics');

exports.getTopics = function (callback) {
  topics.find().toArray(callback);
};

exports.getFormalTopics = function (callback) {
  topics.find({type: 'formal'}).toArray(callback);
};

exports.getInviteTopics = function (callback) {
  topics.find({type: 'wish'}).toArray(callback);
};

exports.plus = function (id, who, callback) {
  topics.findAndModify(
    {
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

exports.changeTopic = function (id, update, callback) {
  update.updateAt = new Date();
  topics.update({_id: mongo.ObjectID.createFromHexString(id)}, {$set: update}, callback);
};

exports.findOne = function (id, callback) {
  topics.findOne({_id: mongo.ObjectID.createFromHexString(id)}, callback);
};
