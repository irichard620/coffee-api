'use strict';

const getDb = require("../db/db").getDb;
const getBeanDoc = require("../db/bean");

module.exports = {
  createBean: createBean,
};

function createBean(req, res) {
  const db = getDb();
  const collection = db.collection('beans');
  const dbDoc = getBeanDoc(req.swagger.params.body.value);
  collection.insertOne(dbDoc, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(201);
      res.json("Successfully created bean")
    }
  });
}
