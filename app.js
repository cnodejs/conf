var path = require('path');

var connect = require('connect');

var app = connect();
app.use("/assets", connect.static(path.join(__dirname, "assets")));
app.use(function (req, res, next) {
  res.writeHead(200);
  res.end("Hu.js coming soon!");
});
app.listen(8080);
