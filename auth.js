/**
 * Twitter and Github Auth with everyauth module
 */

var everyauth = require('everyauth');
var mongoskin = require('mongoskin');
var config = require('./config');

var users = mongoskin.db(config.db).collection('users');

// Configure Auth

everyauth.github
  .appId(config.githubClientId)
  .appSecret(config.githubClientSecret)
  .findOrCreateUser(function (session, accessToken, accessTokenSecret, githubUserData) {
    users.insert({
      id: githubUserData.id,
      type: 'github',
      data: githubUserData
    }, function (err) {
      // TODO
    });
    session.authType = 'github';
    return githubUserData;
  })
  .redirectPath('/');

everyauth.twitter
  .consumerKey(config.twitterConsumerKey)
  .consumerSecret(config.twitterConsumerSecret)
  .findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserData) {
    users.insert({
      id: twitterUserData.id,
      type: 'twitter',
      data: twitterUserData
    }, function (err) {
      // TODO
    });
    session.authType = 'twitter';
    return twitterUserData;
  })
  .redirectPath('/');

everyauth.everymodule
  .findUserById(function (userId, callback) {
    users.findOne({ id: userId }, function (err, user) {
      if (err) return callback(err);
      callback(null, user.data);
    });
  })
  .logoutPath('/oauth/logout')
  .handleLogout(function (req, res) {
    var self = this;
    var id = req.session.auth[req.session.authType].id /* Twitter */ || req.session.auth.userId /* Github */;
    users.remove({ id: id }, function (err) {
      req.session.authType = null;
      req.logout();
      res.redirect(self.logoutRedirectPath());
    });
  });

module.exports = everyauth.middleware;