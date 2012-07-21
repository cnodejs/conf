exports.status = function (req, res, next) {
  res.json({status: 'success', now: new Date()});
};