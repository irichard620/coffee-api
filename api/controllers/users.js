const { getDb } = require('../db/db');
const getUserDoc = require('../db/user');
const { getUserRecipeDoc } = require('../db/recipe');

function getUserHandler(req, res) {
  if (!req.uid || req.uid === '') {
    res.status(401);
    res.json('No user passed');
    return;
  }
  const db = getDb();
  const collection = db.collection('users');
  collection.findOne({ auth_id: req.uid }, (err, user) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else if (!user) {
      // Create blank user
      const dbDoc = getUserDoc(req.uid);
      collection.insertOne(dbDoc, (err2) => {
        if (err2) {
          res.status(500);
          res.json(err2);
        } else {
          res.status(200);
          res.json(dbDoc);
        }
      });
    } else {
      // Return the user
      res.status(200);
      res.json(user);
    }
  });
}

function getUserBackupHandler(req, res) {
  if (!req.uid || req.uid === '') {
    res.status(401);
    res.json('No user passed');
    return;
  }

  // Get user id so we can get their recipes
  const db = getDb();
  const collection = db.collection('users');
  collection.findOne({ auth_id: req.uid }, (err, user) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else if (!user) {
      // Return nothing
      res.status(200);
      res.json({ recipes: [] });
    } else {
      // Now, let's find their recipes and return
      const recipeCollection = db.collection('user_recipes');
      recipeCollection.find({ user_id: user.user_id }).toArray((err2, items) => {
        if (err2) {
          res.status(500);
          res.json(err2);
        } else {
          res.status(200);
          res.json({ recipes: items });
        }
      });
    }
  });
}

function createUserBackupHandler(req, res) {
  if (!req.uid || req.uid === '') {
    res.status(401);
    res.json('No user passed');
    return;
  }

  // Get user id so we can post their recipes
  const db = getDb();
  const collection = db.collection('users');
  collection.findOne({ auth_id: req.uid }, (err, user) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else if (!user) {
      // Return nothing
      res.status(400);
      res.json('No user found');
    } else {
      // Now, let's find their recipes and return
      const recipeCollection = db.collection('user_recipes');
      const backupRecipes = req.swagger.params.body.value.recipes || [];
      // Create dictionary for quick lookup
      const backupRecipesDict = {};
      for (let i = 0; i < backupRecipes.length; i += 1) {
        const currentRecipeDoc = getUserRecipeDoc(backupRecipes[i], user.user_id);
        backupRecipesDict[currentRecipeDoc.recipe_id] = currentRecipeDoc;
      }
      recipeCollection.find({ user_id: user.user_id }).toArray((err2, items) => {
        if (err2) {
          res.status(500);
          res.json(err2);
        } else {
          // Compare recipes to backup vs current recipes
          for (let j = 0; j < items.length; j += 1) {
            const currentItem = items[j];
            if (!(currentItem.recipe_id in backupRecipesDict)) {
              // If here but not in dict, delete
              recipeCollection.deleteOne({ recipe_id: currentItem.recipe_id }, (err3) => {
                if (err3) {
                  res.status(500);
                  res.json(err3);
                }
              });
            } else {
              // If in both, update
              recipeCollection.replaceOne(
                { recipe_id: currentItem.recipe_id },
                backupRecipesDict[currentItem.recipe_id],
                (err3) => {
                  if (err3) {
                    res.status(500);
                    res.json(err3);
                  }
                },
              );
              backupRecipesDict[currentItem.recipe_id] = 0;
            }
          }
          // For all new ones where not set to 0, create
          Object.keys(backupRecipesDict).forEach((key) => {
            if (backupRecipesDict[key] !== 0) {
              recipeCollection.insertOne(backupRecipesDict[key], (err3) => {
                if (err3) {
                  res.status(500);
                  res.json(err3);
                }
              });
            }
          });
          // TODO: If successful, update last_backup and return
          res.status(201);
          res.json('Backup successful');
        }
      });
    }
  });
}

module.exports = {
  getUser: getUserHandler,
  getLatestUserBackup: getUserBackupHandler,
  createUserBackup: createUserBackupHandler,
};
