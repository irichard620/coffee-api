const { getDb } = require('../../db/db')
const getIngredientDoc = require('../../db/mixxy/ingredient')

function createIngredientHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  const collection = db.collection('mixxy_ingredients')
  const dbDoc = getIngredientDoc(req.swagger.params.body.value)
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(201)
      res.json('Successfully created ingredient')
    }
  })
}

function getIngredientsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('mixxy_ingredients')
  collection
    .find({})
    .sort({ name: 1 })
    .toArray((err, ingredientItems) => {
      if (err) {
        res.status(500)
        res.json(err)
      } else {
        res.status(200)
        res.json(ingredientItems)
      }
    })
}

module.exports = {
  createMixxyIngredient: createIngredientHandler,
  getMixxyIngredients: getIngredientsHandler,
}
