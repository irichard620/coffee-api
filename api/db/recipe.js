const uuidv4 = require('uuid/v4');

module.exports = getRecipeDoc

function getRecipeDoc(recipeModel) {
  let dbDoc = {}
  if (!recipeModel.recipe_id) {
    dbDoc["recipe_id"] = uuidv4();
  } else {
    dbDoc["recipe_id"] = recipeModel.recipe_id
  }
  dbDoc["sponsor_id"] = recipeModel.sponsor_id || ""
  dbDoc["brewing_vessel"] = recipeModel.brewing_vessel
  dbDoc["filter_type"] = recipeModel.filter_type
  dbDoc["orientation"] = recipeModel.orientation
  dbDoc["recipe_name"] = recipeModel.recipe_name
  dbDoc["total_coffee"] = recipeModel.total_coffee
  dbDoc["grind_size"] = recipeModel.grind_size
  dbDoc["total_water"] = recipeModel.total_water
  dbDoc["water_temp"] = recipeModel.water_temp
  let stepsToAdd = []
  for (step of recipeModel.steps) {
    stepsToAdd.push(getStepDoc(step))
  }
  dbDoc["steps"] = stepsToAdd
  dbDoc["status"] = recipeModel.status
  dbDoc["default"] = recipeModel.default
  dbDoc["favorited"] = recipeModel.favorited
  return dbDoc
}

function getStepDoc(stepModel) {
  let dbDoc = {}
  dbDoc["title"] = stepModel.title
  dbDoc["properties"] = stepModel.properties
  return dbDoc
}
