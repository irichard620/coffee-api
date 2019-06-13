const uuidv4 = require('uuid/v4');

module.exports = getRecipeDoc

function getRecipeDoc(recipeModel) {
  let dbDoc = {}
  if (!recipeModel._id) {
    dbDoc["_id"] = uuidv4();
  }
  dbDoc["sponsor_id"] = recipeModel.sponsor_id || ""
  dbDoc["brewing_vessel"] = recipeModel.brewing_vessel
  dbDoc["filter_type"] = recipeModel.filter_type
  dbDoc["title"] = recipeModel.title
  dbDoc["grams_coffee"] = recipeModel.grams_coffee
  dbDoc["grind_type"] = recipeModel.grind_type
  dbDoc["grams_water"] = recipeModel.grams_water
  dbDoc["water_temp"] = recipeModel.water_temp
  dbDoc["status"] = recipeModel.status
  return dbDoc
}
