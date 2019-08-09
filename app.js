'use strict';

var SwaggerConnect = require('swagger-connect');
require('dotenv').config()
var admin = require('firebase-admin');
const initDb = require("./api/db/db").initDb;
const authMiddleware = require("./api/middleware/auth");
var app = require('connect')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

var firebaseConfig = {
  apiKey: "AIzaSyDcZy08LfkZkpoxqxtluSTVvnYjLKq-mzk",
  authDomain: "drippy-505b3.firebaseapp.com",
  databaseURL: "https://drippy-505b3.firebaseio.com",
  projectId: "drippy-505b3",
  storageBucket: "",
  messagingSenderId: "1067564843347",
  appId: "1:1067564843347:web:486992b804c221c6"
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);

SwaggerConnect.create(config, function(err, swaggerConnect) {
  if (err) { throw err; }

  // install middleware
  app.use('/beans', authMiddleware);
  app.use('/recipes', authMiddleware);
  app.use('/sponsors', authMiddleware);
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
