var topic = require('../proxy/topic');
var news = require('../proxy/news');
var pages = require('../proxy/page');

exports.topics = function (req, res, next) {
  var user = req.session.oauthUser;
  topic.getTopics(function (err, row) {
    if (err) {
      // TODO
      res.send(500, {'status': 'fail', 'message': 'Internal Server Error'});
      return;
    }
    res.render('admin/topics', {
      resources: req.getResources('index'),
      formal: row.filter(function (topic) {
        return topic.type === "formal";
      }),
      wish: row.filter(function (topic) {
        return topic.type === "wish";
      }),
      viewname: "topics",
      user: user || {},
      csrf: req.session._csrf
    });
  });
};

exports.updateTopic = function (req, res, next) {
  var post = req.body;
  var update = {};
  if (post.type) {
    update.type = post.type;
  }
  if (post.name) {
    update.name = post.name;
  }
  if (post.speaker) {
    update.speaker = post.speaker;
  }
  topic.changeTopic(post.id, update, function (err) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({"status": "success"});
  });
};

exports.viewTopic = function (req, res, next) {
  var get = req.query;
  var id = get.id;
  topic.findOne(id, function (err, record) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({"status": "success", "topic": record});
  });
};


exports.news = function (req, res, next) {
  var user = req.session.oauthUser;
  news.getNews(function (err, row) {
    if (err) {
      // TODO
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.render('admin/news', {
      resources: req.getResources('index'),
      news: row,
      user: user || {},
      csrf: req.session._csrf,
      layout: false
    });
  });
};

exports.addNews = function (req, res, next) {
  var user = req.session.oauthUser;

  var post = req.body;
  var doc = {
    title: post.title,
    content: post.content,
    date: new Date()
  };

  news.addNews(doc, function (err, news) {
    if (err) {
      next(err);
      return;
    }
    res.send({'status': 'success', 'news': news});
  });
};

exports.editNews = function (req, res, next) {
  var user = req.session.oauthUser;

  var post = req.body;
  var doc = {
    title: post.title,
    content: post.content
  };

  news.editNews(post.id, doc, function (err, record) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({'status': 'success', 'news': news});
  });
};

exports.viewNews = function (req, res, next) {
  var get = req.query;
  var id = get.id;
  news.findOne(id, function (err, record) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({"status": "success", "news": record});
  });
};

exports.removeNews = function (req, res, next) {
  var post = req.body;
  var id = post.id;
  
  news.removeNews(id, function (err, record) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({"status": "success", "news": record});
  });
};


exports.pages = function (req, res, next) {
  var user = req.session.oauthUser;
  pages.getPages(function (err, row) {
    if (err) {
      // TODO
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.render('admin/pages', {
      resources: req.getResources('index'),
      en: row.filter(function (page) {
        return page.language === "en-us";
      }),
      zh: row.filter(function (page) {
        return page.language === "zh-cn";
      }),
      user: user || {},
      csrf: req.session._csrf,
      layout: false
    });
  });
};

exports.addPage = function (req, res, next) {
  var user = req.session.oauthUser;

  var post = req.body;
  var doc = {
    title: post.title,
    sign: post.sign,
    content: post.content,
    language: req.locales[0]
  };

  pages.addPage(doc, function (err, page) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({'status': 'success', 'page': page});
  });
};

exports.editPage = function (req, res, next) {
  var post = req.body;
  var doc = {
    title: post.title,
    sign: post.sign,
    content: post.content
  };

  pages.editPage(post.id, doc, function (err, record) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({'status': 'success', 'page': page});
  });
};

exports.viewPage = function (req, res, next) {
  var get = req.query;
  var sign = get.sign;
  pages.findOne(sign, function (err, record) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({"status": "success", "page": record});
  });
};

exports.removePage = function (req, res, next) {
  var post = req.body;
  var id = post.id;

  pages.removePage(id, function (err, record) {
    if (err) {
      res.send({'status': 'fail', 'message': 'Internal Server Error'}, 500);
      return;
    }
    res.send({"status": "success", "page": record});
  });
};