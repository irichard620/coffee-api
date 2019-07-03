const uuidv4 = require('uuid/v4');

module.exports = getRecipeDoc

function getRecipeDoc(recipeModel) {
  let dbDoc = {}
  if (!recipeModel.id) {
    dbDoc["_id"] = uuidv4();
  } else {
    dbDoc["_id"] = recipeModel.id
  }
  dbDoc["sponsor_id"] = recipeModel.sponsor_id || ""
  dbDoc["brewing_vessel"] = recipeModel.brewing_vessel
  dbDoc["vessel_id"] = recipeModel.vessel_id
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
  dbDoc["steps"] = recipeModel.steps
  dbDoc["status"] = recipeModel.status
  return dbDoc
}

function getStepDoc(stepModel) {
  let dbDoc = {}
  if (!stepModel.id) {
    dbDoc["_id"] = uuidv4();
  } else {
    dbDoc["_id"] = stepModel.id
  }
  dbDoc["title"] = stepModel.title
  dbDoc["type"] = stepModel.type
  dbDoc["properties"] = stepModel.properties
  return dbDoc
}
