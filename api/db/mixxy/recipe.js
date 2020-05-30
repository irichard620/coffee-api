const uuidv4 = require('uuid/v4');

function getIngredientDoc(ingredientModel) {
  const dbDoc = {};
  if (!ingredientModel.ingredient_id) {
    dbDoc.ingredient_id = uuidv4();
  } else {
    dbDoc.ingredient_id = ingredientModel.ingredient_id;
  }

  // Assign other values
  dbDoc.title = ingredientModel.title || '';
  dbDoc.amount = ingredientModel.amount || '0';
  dbDoc.fractional_amount = ingredientModel.fractional_amount || '';
  dbDoc.amount_type = ingredientModel.amount_type || '';

  return dbDoc;
}

function getStepDoc(stepModel) {
  const dbDoc = {};
  dbDoc.title = stepModel.title || '';
  return dbDoc;
}

function getMixxyRecipeDoc(recipeModel) {
  const dbDoc = {};
  if (!recipeModel.recipe_id) {
    dbDoc.recipe_id = uuidv4();
  } else {
    dbDoc.recipe_id = recipeModel.recipe_id;
  }
  // Recipe metadata
  dbDoc.recipe_name = recipeModel.recipe_name || '';
  dbDoc.recipe_description = recipeModel.recipe_description || '';
  dbDoc.recipe_type = recipeModel.recipe_type || '';
  dbDoc.base_spirit = recipeModel.base_spirit || '';
  dbDoc.serving_glass = recipeModel.serving_glass || '';
  dbDoc.total_ounces = recipeModel.total_ounces || 0;

  // Steps
  const stepsToAdd = [];
  for (let i = 0; i < recipeModel.steps.length; i += 1) {
    stepsToAdd.push(getStepDoc(recipeModel.steps[i]));
  }
  dbDoc.steps = stepsToAdd;
  // Ingredients
  const ingredientsToAdd = [];
  for (let i = 0; i < recipeModel.ingredients.length; i += 1) {
    ingredientsToAdd.push(getIngredientDoc(recipeModel.ingredients[i]));
  }
  dbDoc.ingredients = ingredientsToAdd;

  // Recipe association
  dbDoc.sponsor_card_id = recipeModel.sponsor_card_id || '';
  dbDoc.campaign_id = recipeModel.campaign_id || '';
  dbDoc.master_list_id = recipeModel.master_list_id || '';
  dbDoc.status = recipeModel.status || 'INACTIVE';
  return dbDoc;
}

module.exports = getMixxyRecipeDoc;
