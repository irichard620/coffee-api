const { getDb } = require('../db/db');
const getRecipeDoc = require('../db/recipe');

function createRecipeHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401);
    res.json('Not an admin user');
    return;
  }
  const db = getDb();
  const collection = db.collection('recipes');
  const dbDoc = getRecipeDoc(req.swagger.params.body.value);
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(201);
      res.json('Successfully created recipe');
    }
  });
}

function getDefaultRecipesHandler(req, res) {
  const db = getDb();
  const collection = db.collection('recipes');
  collection.find({ status: 'ACTIVE', default: true }).toArray((err, items) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(200);
      res.json(items);
    }
  });
}

module.exports = {
  createRecipe: createRecipeHandler,
  getDefaultRecipes: getDefaultRecipesHandler,
};
