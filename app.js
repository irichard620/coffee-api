'use strict';

var SwaggerConnect = require('swagger-connect');
require('dotenv').config()
const initDb = require("./api/db/db").initDb;
const getDb = require("./api/db/db").getDb;
var app = require('connect')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerConnect.create(config, function(err, swaggerConnect) {
  if (err) { throw err; }

  // install middleware
  swaggerConnect.register(app);

  var port = process.env.PORT || 10010;

  initDb(function (err) {
    app.listen(port, function (err) {
      if (err) {
          throw err;
      }
      console.log("API Up and running on port " + port);
    });
  });
});
