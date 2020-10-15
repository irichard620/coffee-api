const Sentry = require('@sentry/node')
const { getDb } = require('../../db/db')

async function getBartenderRecipesHandler(req, res) {
  let transaction
  try {
    transaction = Sentry.startTransaction({
      op: 'transaction',
      name: 'Bartender Transaction',
    })
    const db = getDb()
    const collection = db.collection('mixxy_recipes')
    const ingredientIds = req.swagger.params.body.value.ingredientIds || []
    const baseSpirit = req.swagger.params.body.value.baseSpirit || ''
    const baseSpiritFilter = baseSpirit !== '' ? { base_spirit: baseSpirit } : {}
    const allRecipes = await collection.find({ status: 'ACTIVE', ...baseSpiritFilter }).toArray()
    const matchedRecipes = []
    for (let recipe of allRecipes) {
      const requiredIngredients = recipe.ingredients.filter(
        (ingredient) => !(ingredient.amount_type === 'Garnish' || ingredient.amount_type === 'Rim')
      )
      const missingIngredients = requiredIngredients.filter((ingredient) =>
        Array.isArray(ingredient.ingredient_id)
          ? !ingredient.ingredient_id.some((ingredientId) => ingredientIds.includes(ingredientId))
          : !ingredientIds.includes(ingredient.ingredient_id)
      )
      if (missingIngredients.length < requiredIngredients.length) {
        // If we have atleast one ingredient, add recipe
        recipe.missingCount = missingIngredients.length
        matchedRecipes.push(recipe)
      }
    }
    let sortedRecipes = matchedRecipes.sort((a, b) => (a.missingCount > b.missingCount ? 1 : -1))
    res.status(200)
    res.json(sortedRecipes)
  } catch (err) {
    Sentry.captureException(err)
    res.status(500)
    res.json(err)
  } finally {
    if (transaction) {
      transaction.finish()
    }
  }
}

module.exports = {
  getBartenderRecipes: getBartenderRecipesHandler,
}
