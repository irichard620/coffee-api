const uuidv4 = require('uuid/v4')

function getIngredientDoc(ingredientModel) {
  const dbDoc = {}
  if (!ingredientModel.ingredient_id) {
    dbDoc.ingredient_id = uuidv4()
  } else {
    dbDoc.ingredient_id = ingredientModel.ingredient_id
  }
  dbDoc.name = ingredientModel.name || ''
  dbDoc.category = ingredientModel.category || ''
  return dbDoc
}

module.exports = getIngredientDoc
