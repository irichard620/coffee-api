const Sentry = require('@sentry/node')
const Filter = require('bad-words')
const { getDb } = require('../../db/db')
const getUserDoc = require('../../db/mixxy/user')
const { getMixxyUserRecipeDoc } = require('../../db/mixxy/recipe')

const filter = new Filter()

async function createUserHandler(req, res) {
  try {
    const db = getDb()
    const collection = db.collection('mixxy_users')

    // Sign up
    // If we get email, token, display name
    // Login
    // If we just get email and

    // Use email to check if user exists
    const email = req.swagger.params.body.value.email || ''

    // Return user if only auth passed
    if (req.uid && !email) {
      // Find by id
      const existingUser = await collection.findOne({ auth_id: req.uid })
      if (!existingUser) {
        res.status(404)
        res.json('User not found')
        return
      }
      res.status(201)
      res.json(getUserDoc(existingUser))
      return
    }

    // If user, check if auth_id exists
    if (!req.uid || req.uid === '') {
      res.status(400)
      res.json('Missing auth id')
      return
    }

    const existingUser = await collection.findOne({ email: email.toLowerCase() })

    // If no user, create with email and display name
    if (!existingUser) {
      // let displayName = req.swagger.params.body.value.display_name

      // Create user
      const userItem = getUserDoc({ ...req.swagger.params.body.value, auth_id: req.uid })
      await collection.insertOne(userItem)
      res.status(201)
      res.json(userItem)
    } else {
      if (existingUser.auth_id && existingUser.auth_id !== req.uid) {
        res.status(409)
        res.json('Email conflict')
        return
      }
      // Return
      res.status(201)
      res.json(getUserDoc(existingUser))
      return
    }
  } catch (err) {
    Sentry.captureException(err)
    res.status(500)
    res.json(err)
  }
}

async function updateDisplayNameHandler(req, res) {
  try {
    const db = getDb()
    const collection = db.collection('mixxy_users')

    // If user, check if auth_id exists
    if (!req.uid || req.uid === '') {
      res.status(400)
      res.json('Missing auth id')
      return
    }

    // TODO: screen display name for unwanted characters
    const displayName = req.swagger.params.body.value.display_name
    const fullName = req.swagger.params.body.value.full_name
    const existingDisplayName = await collection.findOne({
      display_name: displayName.toLowerCase(),
    })
    if (existingDisplayName) {
      res.status(409)
      res.json('Display name conflict')
      return
    }

    if (filter.isProfane(displayName) || filter.isProfane(fullName)) {
      res.status(400)
      res.json('Profanity')
      return
    }

    const newValues = { $set: { display_name: displayName.toLowerCase(), full_name: fullName } }
    await collection.updateOne({ auth_id: req.uid }, newValues)

    res.status(200)
    res.json('Display name updated')
    return
  } catch (err) {
    Sentry.captureException(err)
    res.status(500)
    res.json(err)
  }
}

async function syncUserRecipesHandler(req, res) {
  try {
    const db = getDb()
    const userCollection = db.collection('mixxy_users')
    const recipeCollection = db.collection('mixxy_user_recipes')

    // If user, check if auth_id exists
    if (!req.uid || req.uid === '') {
      res.status(400)
      res.json('Missing auth id')
      return
    }

    // Get user
    const user = await userCollection.findOne({
      auth_id: req.uid,
    })
    if (!user) {
      res.status(400)
      res.json('No user found')
      return
    }

    // Get recipes from db
    const dbRecipes = await recipeCollection.find({ user_id: user.user_id }).toArray()
    const dbRecipesDict = {}
    for (let dbRecipe of dbRecipes) {
      const dbRecipeDoc = getMixxyUserRecipeDoc(dbRecipe, user.user_id)
      dbRecipesDict[dbRecipeDoc.recipe_id] = dbRecipe
    }

    // Recipes from app
    const appRecipes = req.swagger.params.body.value.recipes || []

    // Handle updating and deleting of existing ones
    for (let i = 0; i < appRecipes.length; i++) {
      const appRecipe = getMixxyUserRecipeDoc(appRecipes[i], user.user_id)
      // Recipe in app but not DB - create it
      if (!(appRecipe.recipe_id in dbRecipesDict)) {
        await recipeCollection.insertOne(appRecipe)
      } else {
        const dbRecipe = dbRecipesDict[appRecipe.recipe_id]
        // If app recipe more up to date, replace one in DB
        // Otherwise, replace the recipe that we respond to app with
        if (
          (appRecipe.deleted_at && !dbRecipe.deleted_at) ||
          (appRecipe.updated_at && appRecipe.updated_at > dbRecipe.updated_at)
        ) {
          await recipeCollection.replaceOne({ recipe_id: appRecipe.recipe_id }, appRecipe)
        } else {
          appRecipes[i] = dbRecipe
        }
        dbRecipesDict[appRecipe.recipe_id] = 0
      }
    }

    // For all new ones where not set to 0, send back to app
    Object.keys(dbRecipesDict).forEach((key) => {
      if (dbRecipesDict[key] !== 0) {
        // Add to response to app
        appRecipes.push(dbRecipesDict[key])
      }
    })

    res.status(201)
    res.json(appRecipes)
  } catch (err) {
    Sentry.captureException(err)
    res.status(500)
    res.json(err)
  }
}

module.exports = {
  createUser: createUserHandler,
  updateDisplayName: updateDisplayNameHandler,
  syncUserRecipes: syncUserRecipesHandler,
}
