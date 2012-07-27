var config = require('../config');
var mongo = require('mongoskin');
var db = mongo.db(config.db);

var pages = db.collection('pages');

exports.getPages = function(callback) {
  pages.find().toArray(callback);
};

exports.addPage = function(page, callback) {
  pages.insert(page, callback);
};

exports.editPage = function(id, update, callback) {
  update.updateAt = new Date();
  pages.update({_id: mongo.ObjectID.createFromHexString(id)}, {$set: update}, callback);
};

exports.removePage = function(id, callback) {
  pages.remove({_id: mongo.ObjectID.createFromHexString(id)}, callback);
};

exports.findOne = function(sign, callback) {
  pages.findOne({sign: sign}, callback);
};