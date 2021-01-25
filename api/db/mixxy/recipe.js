const uuidv4 = require('uuid/v4')

function getIngredientDoc(ingredientModel, version) {
  const dbDoc = {}
  if (!ingredientModel.ingredient_id) {
    dbDoc.ingredient_id = uuidv4()
  } else {
    dbDoc.ingredient_id = ingredientModel.ingredient_id
  }

  // Assign other values
  dbDoc.title = ingredientModel.title || ''
  dbDoc.amount = ingredientModel.amount || '0'
  dbDoc.fractional_amount = ingredientModel.fractional_amount || ''
  dbDoc.amount_type = ingredientModel.amount_type || ''

  if (!version || version === '1.0.0') {
    if (dbDoc.amount_type === '') {
      dbDoc.amount_type = 'Piece'
    } else if (dbDoc.amount_type === 'Milliliter' || dbDoc.amount_type === 'Centiliter') {
      let rawDecimal = parseInt(dbDoc.amount)
      if (dbDoc.fractional_amount !== '') {
        const splits = dbDoc.fractional_amount.split('/')
        if (splits.length === 2) {
          rawDecimal += parseInt(splits[0]) / parseInt(splits[1])
        }
      }
      const multiplier = dbDoc.amount_type === 'Milliliter' ? 0.0338 : 0.338
      const rawConvertedDecimal = rawDecimal * multiplier
      const convertedDecimalToEighth = Math.round(rawConvertedDecimal * 8) / 8
      const splitConvertedDecimalToEighth = [
        convertedDecimalToEighth > 0
          ? Math.floor(convertedDecimalToEighth)
          : Math.ceil(convertedDecimalToEighth),
        convertedDecimalToEighth % 1,
      ]
      dbDoc.amount = splitConvertedDecimalToEighth[0].toString()
      dbDoc.fractional_amount = getFractionFromRoundedDecimal(splitConvertedDecimalToEighth[1])
      dbDoc.amount_type = 'Ounce'
    }
  }

  return dbDoc
}

function getFractionFromRoundedDecimal(roundedDecimal) {
  switch (roundedDecimal) {
    case 0:
      return ''
    case 0.125:
      return '1/8'
    case 0.25:
      return '1/4'
    case 0.375:
      return '3/8'
    case 0.5:
      return '1/2'
    case 0.625:
      return '5/8'
    case 0.75:
      return '3/4'
    case 0.875:
      return '7/8'
  }
  return ''
}

function getStepDoc(stepModel) {
  const dbDoc = {}
  dbDoc.title = stepModel.title || ''
  return dbDoc
}

function getMixxyRecipeDoc(recipeModel, version) {
  const dbDoc = {}
  if (!recipeModel.recipe_id) {
    dbDoc.recipe_id = uuidv4()
  } else {
    dbDoc.recipe_id = recipeModel.recipe_id
  }
  // Recipe metadata
  dbDoc.recipe_name = recipeModel.recipe_name || ''
  dbDoc.recipe_description = recipeModel.recipe_description || ''
  dbDoc.recipe_type = recipeModel.recipe_type || ''
  dbDoc.base_spirit = recipeModel.base_spirit || ''
  dbDoc.serving_glass = recipeModel.serving_glass || ''
  dbDoc.total_ounces = recipeModel.total_ounces || 0
  dbDoc.image_link = recipeModel.image_link || ''

  // Steps
  const stepsToAdd = []
  for (let i = 0; i < recipeModel.steps.length; i += 1) {
    stepsToAdd.push(getStepDoc(recipeModel.steps[i]))
  }
  dbDoc.steps = stepsToAdd
  // Ingredients
  const ingredientsToAdd = []
  for (let i = 0; i < recipeModel.ingredients.length; i += 1) {
    ingredientsToAdd.push(getIngredientDoc(recipeModel.ingredients[i], version))
  }
  dbDoc.ingredients = ingredientsToAdd

  // Recipe association
  dbDoc.sponsor_card_id = recipeModel.sponsor_card_id || ''
  dbDoc.campaign_id = recipeModel.campaign_id || ''
  dbDoc.master_list_id = recipeModel.master_list_id || ''
  dbDoc.status = recipeModel.status || 'INACTIVE'
  return dbDoc
}

function getMixxyUserRecipeDoc(recipeModel, userID) {
  const dbDoc = {}
  if (!recipeModel.recipe_id) {
    dbDoc.recipe_id = uuidv4()
  } else {
    dbDoc.recipe_id = recipeModel.recipe_id
  }
  // Recipe metadata
  dbDoc.recipe_name = recipeModel.recipe_name || ''
  dbDoc.recipe_description = recipeModel.recipe_description || ''
  dbDoc.recipe_type = recipeModel.recipe_type || ''
  dbDoc.base_spirit = recipeModel.base_spirit || ''
  dbDoc.serving_glass = recipeModel.serving_glass || ''
  dbDoc.total_ounces = recipeModel.total_ounces || 0
  dbDoc.image_link = recipeModel.image_link || ''

  // Steps
  const stepsToAdd = []
  for (let i = 0; i < recipeModel.steps.length; i += 1) {
    stepsToAdd.push(getStepDoc(recipeModel.steps[i]))
  }
  dbDoc.steps = stepsToAdd
  // Ingredients
  const ingredientsToAdd = []
  for (let i = 0; i < recipeModel.ingredients.length; i += 1) {
    ingredientsToAdd.push(getIngredientDoc(recipeModel.ingredients[i], '2.2.0'))
  }
  dbDoc.ingredients = ingredientsToAdd

  // Recipe association
  dbDoc.sponsor_card_id = recipeModel.sponsor_card_id || ''
  dbDoc.campaign_id = recipeModel.campaign_id || ''
  dbDoc.master_list_id = recipeModel.master_list_id || ''
  dbDoc.status = recipeModel.status || 'INACTIVE'

  // User specific
  dbDoc.user_id = userID || null
  dbDoc.favorited = recipeModel.favorited || false
  dbDoc.deleted_at = recipeModel.deleted_at || null
  dbDoc.updated_at = recipeModel.updated_at || null
  dbDoc.created_at = recipeModel.created_at || null
  return dbDoc
}

module.exports = {
  getMixxyRecipeDoc,
  getMixxyUserRecipeDoc,
}
