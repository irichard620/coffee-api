const uuidv4 = require('uuid/v4')

function getStepDoc(stepModel) {
  const dbDoc = {}
  dbDoc.title = stepModel.title || ''
  dbDoc.notes = stepModel.notes || ''
  dbDoc.properties = stepModel.properties || {}
  return dbDoc
}

function getRecipeDoc(recipeModel) {
  const dbDoc = {}
  if (!recipeModel.recipe_id) {
    dbDoc.recipe_id = uuidv4()
  } else {
    dbDoc.recipe_id = recipeModel.recipe_id
  }
  dbDoc.sponsor_id = recipeModel.sponsor_id || ''
  dbDoc.brewing_vessel = recipeModel.brewing_vessel || ''
  dbDoc.filter_type = recipeModel.filter_type || ''
  dbDoc.orientation = recipeModel.orientation || ''
  dbDoc.recipe_name = recipeModel.recipe_name || ''
  dbDoc.recipe_description = recipeModel.recipe_description || ''
  dbDoc.total_coffee = recipeModel.total_coffee || ''
  dbDoc.grind_size = recipeModel.grind_size || ''
  dbDoc.total_water = recipeModel.total_water || ''
  dbDoc.water_temp = recipeModel.water_temp || ''
  const stepsToAdd = []
  for (let i = 0; i < recipeModel.steps.length; i += 1) {
    stepsToAdd.push(getStepDoc(recipeModel.steps[i]))
  }
  dbDoc.steps = stepsToAdd
  dbDoc.status = recipeModel.status || 'ACTIVE'
  dbDoc.default = recipeModel.default || false
  dbDoc.favorited = recipeModel.favorited || false
  return dbDoc
}

module.exports = getRecipeDoc
