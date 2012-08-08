if (process.env.APP_ENV != "test") {

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
}
else {

    // mock backend 

    var pages = {};

    function asArray(hash){
        var arr = [];
        for(var i in hash) { arr.push(hash[i]); }
        return arr;
    }
    function findBySign(sign){
      for(var i in pages){
        if(pages[i].sign === sign){
            return pages[i];
        }
      }
      return undefined;
    }

    exports.getPages = function(callback) {
      callback(undefined, asArray(pages));
    };

    exports.addPage = function(page, callback) {
      page["id"] = Date.now().toString();
      pages[page.id] = page;
      callback(undefined, asArray(page));
    };

    exports.editPage = function(id, update, callback) {
      pages[id] = update;
      callback(undefined, asArray(pages));
    };

    exports.removePage = function(id, callback) {
      delete pages[id];
      callback(undefined, asArray(pages));
    };

    exports.findOne = function(sign, callback) {
      callback(undefined, findBySign(sign));
    };
}