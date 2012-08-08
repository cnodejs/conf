if (process.env.APP_ENV != "test") {

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
}
else {
    // mock backend 

    var topics = {};

    function asArray(hash){
        var arr = [];
        for(var i in hash) { arr.push(hash[i]); }
        return arr;
    }

    function findBy(attr, val){
      var result =[];
      for(var i in topics){
        if(topics[i][attr] === val){
            result.push[topics[i]];
        }
      }
      return result;
    }

  exports.getTopics = function (callback) {
    callback(undefined, asArray(topics));
  };

  exports.getFormalTopics = function (callback) {
    callback(undefined, findBy("type", "formal"));
  };

  exports.getInviteTopics = function (callback) {
    callback(undefined, findBy("type", "wish"));
  };

  exports.plus = function (id, who, callback) {
    var topic = topics[id];
    topic["vote"] = (topic["vote"] || []).push(who);
    topics[id] = topic;
    callback(undefined, toArray(topics))
  };

  exports.addTopic = function (topic, callback) {
    topic["id"] = Date.now().toString();
    topics[topic.id] = topic;
    callback(undefined, asArray(topics));
  };

  exports.changeTopic = function (id, update, callback) {
      topics[id] = update;
      callback(undefined, asArray(topics));  
  };
}