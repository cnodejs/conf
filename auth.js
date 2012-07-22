/**
 * Auth with everyauth module
 */

var everyauth = require('everyauth');
var config = require('./config');
var self = this;

// Configure Auth
var users = {};

everyauth.github
  .appId(config.githubClientId)
  .appSecret(config.githubClientSecret)
  .findOrCreateUser(function (session, accessToken, accessTokenSecret, githubUserData) {
    users[githubUserData.id] = githubUserData;
    session.authType = 'github';
    return githubUserData;
  })
  .redirectPath('/');

everyauth.twitter
  .consumerKey(config.twitterConsumerKey)
  .consumerSecret(config.twitterConsumerSecret)
  .findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserData) {
    users[twitterUserData.id] = twitterUserData;
    session.authType = 'twitter';
    return twitterUserData;
  })
  .redirectPath('/');

everyauth.everymodule
  .findUserById(function (userId, callback) {
    return callback(null, users[userId]);
  })
  .logoutPath('/oauth/logout')
  .handleLogout(function (req, res) {
    delete users[req.session.auth[req.session.authType].id];
    req.session.authType = null;
    req.logout();
    res.redirect(this.logoutRedirectPath());
  })

module.exports = everyauth.middleware;