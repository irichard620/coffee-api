const Sentry = require('@sentry/node')
const { getDb } = require('../../db/db')
const getMixxyRecipeDoc = require('../../db/mixxy/recipe')

async function getBlogsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('mixxy_blogs')

  try {
    // Get all active blogs
    const items = await collection
      .find({ status: 'ACTIVE' })
      .sort({ created_at: -1 })
      .toArray()
    for (let item of items) {
      // Get author object
      if (item.author_id) {
        const author = await db.collection('mixxy_authors').findOne({ author_id: item.author_id })
        if (!author) {
          Sentry.captureException(`Author with ID ${item.author_id} not found`)
          res.status(500)
          res.json('Author not found')
        }
        item.author = author
      }

      // Get sponsor object
      if (item.sponsor_card_id) {
        const sponsorCard = await db
          .collection('mixxy_sponsor_cards')
          .findOne({ card_id: item.sponsor_card_id })
        if (!sponsorCard) {
          Sentry.captureException(`Sponsor card with ID ${item.sponsor_card_id} not found`)
          res.status(500)
          res.json('Sponsor card not found')
        }
        item.sponsor_card = sponsorCard
      }

      // Get recipes mentioned
      if (item.recipes_mentioned) {
        const recipesToAdd = []
        const recipesMentioned = await db
          .collection('mixxy_recipes')
          .find({ recipe_id: { $in: item.recipes_mentioned } })
          .toArray()
        for (let recipe of recipesMentioned) {
          recipesToAdd.push(getMixxyRecipeDoc(recipe, '2.1.0'))
        }
        item.recipes = recipesToAdd
      }
    }
    res.status(200)
    res.json(items)
  } catch (err) {
    Sentry.captureException(err)
    res.status(500)
    res.json(err)
  }
}

module.exports = {
  getBlogs: getBlogsHandler,
}
