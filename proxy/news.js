var config = require('../config');
var mongo = require('mongoskin');
var db = mongo.db(config.db);

var news = db.collection('news');

exports.getNews = function(callback) {
  news.find().sort({ date: -1 }).toArray(callback);
};

exports.addNews = function(newNews, callback) {
  news.insert(newNews, callback);
};

exports.editNews = function(id, update, callback) {
  update.updateAt = new Date();
  news.update({_id: mongo.ObjectID.createFromHexString(id)}, {$set: update}, callback);
};

exports.removeNews = function(id, callback) {
  news.remove({_id: mongo.ObjectID.createFromHexString(id)}, callback);
};

exports.findOne = function(id, callback) {
  news.findOne({_id: mongo.ObjectID.createFromHexString(id)}, callback);
};