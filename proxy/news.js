if (process.env.APP_ENV != "test") {

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
}
else {

    // mock backend 

    var news = {};
    
    // seed some content
    var mock_id = Date.now().toString();
    
    news[mock_id] = {
        _id: mock_id,
        title: "Mock Post",
        content: "Lorem Ipsum yada yada",
        date: new Date()
    };

    function asArray(hash){
        var arr = [];
        for(var i in hash) { arr.push(hash[i]); }
        return arr;
    }

    exports.getNews = function(callback) {
      callback(undefined, asArray(news));
    };

    exports.addNews = function(newNews, callback) {
      newNews["_id"] = Date.now().toString();
      news[newNews._id] = newNews;
      callback(undefined, asArray(news));
    };

    exports.editNews = function(id, update, callback) {
      news[id] = update;
      callback(undefined, asArray(news));
    };

    exports.removeNews = function(id, callback) {
      delete news[id];
      callback(undefined, asArray(news));
    };

    exports.findOne = function(id, callback) {
      var result = news[id];
      callback(undefined, result);
    };
}