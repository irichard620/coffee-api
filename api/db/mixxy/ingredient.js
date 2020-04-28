const uuidv4 = require('uuid/v4');

function getIngredientDoc(ingredientModel) {
  const dbDoc = {};
  if (!ingredientModel.ingredient_id) {
    dbDoc.ingredient_id = uuidv4();
  } else {
    dbDoc.ingredient_id = ingredientModel.ingredient_id;
  }
  dbDoc.title = ingredientModel.title || '';
  dbDoc.common_name = ingredientModel.common_name || '';
  dbDoc.description = ingredientModel.description || '';
  dbDoc.classification = ingredientModel.classification || '';
  return dbDoc;
}

module.exports = getIngredientDoc;
