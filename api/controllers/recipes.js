'use strict';

const getDb = require("../db/db").getDb;
const getRecipeDoc = require("../db/recipe");

module.exports = {
  createRecipe: createRecipe,
};

function createRecipe(req, res) {
  const db = getDb();
  const collection = db.collection('recipes');
  const dbDoc = getRecipeDoc(req.swagger.params.body.value);
  collection.insertOne(dbDoc, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(201);
      res.json("Successfully created recipe")
    }
  });
}
