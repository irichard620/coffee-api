const { getDb } = require('../../db/db');
const getMixxyRecipeDoc = require('../../db/mixxy/recipe');

function createRecipeHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401);
    res.json('Not an admin user');
    return;
  }
  const db = getDb();
  const collection = db.collection('mixxy_recipes');
  const dbDoc = getMixxyRecipeDoc(req.swagger.params.body.value);
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

function getRecipesHandler(req, res) {
  const db = getDb();
  const collection = db.collection('mixxy_recipes');
  // Passed in values
  if (req.swagger.params.sponsor_card_id.value) {
    const sponsorCardId = req.swagger.params.sponsor_card_id.value;
    collection.find({ status: 'ACTIVE', sponsor_card_id: sponsorCardId }).toArray((err, items) => {
      if (err) {
        res.status(500);
        res.json(err);
      } else {
        res.status(200);
        res.json(items);
      }
    });
  } else if (req.swagger.params.campaign_id.value) {
    const campaignId = req.swagger.params.campaign_id.value;
    collection.find({ status: 'ACTIVE', campaign_id: campaignId }).toArray((err, items) => {
      if (err) {
        res.status(500);
        res.json(err);
      } else {
        res.status(200);
        res.json(items);
      }
    });
  } else if (req.swagger.params.master_list_id.value) {
    const masterListId = req.swagger.params.master_list_id.value;
    collection.find({ status: 'ACTIVE', master_list_id: masterListId }).toArray((err, items) => {
      if (err) {
        res.status(500);
        res.json(err);
      } else {
        res.status(200);
        res.json(items);
      }
    });
  } else {
    collection.find({ status: 'ACTIVE' })
      .toArray((err, items) => {
        if (err) {
          res.status(500);
          res.json(err);
        } else {
          res.status(200);
          res.json(items);
        }
      });
  }
}

function getRecipeDetailsHandler(req, res) {
  const db = getDb();
  const collection = db.collection('mixxy_shared_recipes');
  const recipeID = req.swagger.params.recipeID.value;
  collection.findOne({ recipe_id: recipeID }, (err, item) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else if (!item) {
      res.status(404);
      res.json('Not found!');
    } else {
      const recipeItem = getMixxyRecipeDoc(item);
      res.status(200);
      res.json(recipeItem);
    }
  });
}

function createSharedRecipeHandler(req, res) {
  const db = getDb();
  const collection = db.collection('mixxy_shared_recipes');
  const recipeID = req.swagger.params.recipeID.value;
  collection.findOne({ recipe_id: recipeID }, (err, item) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else if (!item) {
      const dbDoc = getMixxyRecipeDoc(req.swagger.params.body.value);
      collection.insertOne(dbDoc, (err2) => {
        if (err2) {
          res.status(500);
          res.json(err);
        } else {
          res.status(201);
          res.json(`https://mixxy.page.link/?link=https://mixxy.page.link/${dbDoc.recipe_id}&ibi=com.IanRichard.Mixxy`);
        }
      });
    } else {
      res.status(201);
      res.json(`https://mixxy.page.link/?link=https://mixxy.page.link/${item.recipe_id}&ibi=com.IanRichard.Mixxy`);
    }
  });
}

module.exports = {
  createMixxyRecipe: createRecipeHandler,
  getMixxyRecipes: getRecipesHandler,
  getMixxyRecipe: getRecipeDetailsHandler,
  createSharedMixxyRecipe: createSharedRecipeHandler,
};
