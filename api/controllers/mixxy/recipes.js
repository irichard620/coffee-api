const jwt = require('jsonwebtoken')
const axios = require('axios').default
const uuidv4 = require('uuid/v4')
const { getDb } = require('../../db/db')
const getMixxyRecipeDoc = require('../../db/mixxy/recipe')

function createRecipeHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  const collection = db.collection('mixxy_recipes')
  const dbDoc = getMixxyRecipeDoc(req.swagger.params.body.value)
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(201)
      res.json('Successfully created recipe')
    }
  })
}

function getRecipesHandler(req, res) {
  const db = getDb()
  const version = req.swagger.params.version.value
  const collection = db.collection('mixxy_recipes')
  // Passed in values
  if (req.swagger.params.sponsor_card_id.value) {
    const sponsorCardId = req.swagger.params.sponsor_card_id.value
    collection
      .find({ status: 'ACTIVE', sponsor_card_id: sponsorCardId })
      .sort({ recipe_name: 1 })
      .toArray((err, items) => {
        if (err) {
          res.status(500)
          res.json(err)
        } else {
          const recipes = []
          for (let item of items) {
            recipes.push(getMixxyRecipeDoc(item, version))
          }
          res.status(200)
          res.json(recipes)
        }
      })
  } else if (req.swagger.params.campaign_id.value) {
    const campaignId = req.swagger.params.campaign_id.value
    collection
      .find({ status: 'ACTIVE', campaign_id: campaignId })
      .sort({ recipe_name: 1 })
      .toArray((err, items) => {
        if (err) {
          res.status(500)
          res.json(err)
        } else {
          const recipes = []
          for (let item of items) {
            recipes.push(getMixxyRecipeDoc(item, version))
          }
          res.status(200)
          res.json(recipes)
        }
      })
  } else if (req.swagger.params.master_list_id.value) {
    const masterListId = req.swagger.params.master_list_id.value
    collection
      .find({ status: 'ACTIVE', master_list_id: masterListId })
      .sort({ recipe_name: 1 })
      .toArray((err, items) => {
        if (err) {
          res.status(500)
          res.json(err)
        } else {
          const recipes = []
          for (let item of items) {
            recipes.push(getMixxyRecipeDoc(item, version))
          }
          res.status(200)
          res.json(recipes)
        }
      })
  } else {
    collection
      .find({ status: 'ACTIVE' })
      .sort({ recipe_name: 1 })
      .toArray((err, items) => {
        if (err) {
          res.status(500)
          res.json(err)
        } else {
          const recipes = []
          for (let item of items) {
            recipes.push(getMixxyRecipeDoc(item, version))
          }
          res.status(200)
          res.json(recipes)
        }
      })
  }
}

function getRecipeDetailsHandler(req, res) {
  const db = getDb()
  const version = req.swagger.params.version.value
  const collection = db.collection('mixxy_shared_recipes')
  const recipeID = req.swagger.params.recipeID.value
  collection.findOne({ recipe_id: recipeID }, (err, item) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else if (!item) {
      res.status(404)
      res.json('Not found!')
    } else {
      const recipeItem = getMixxyRecipeDoc(item, version)
      res.status(200)
      res.json(recipeItem)
    }
  })
}

function getLongLink(recipeId, recipeName) {
  return `https://mixxy.page.link/?link=https://mixxyapp.com/${recipeId}&ibi=com.IanRichard.Mixxy&isi=1503445869&st=${recipeName}&si=https://res.cloudinary.com/dn9lxhqla/image/upload/v1591222016/Thumbnail_b4iyzg.jpg`
}

function getShortenedLink(recipeId, recipeName) {
  const instance = axios.create({
    baseURL: process.env.FIREBASE_URL,
    timeout: 1000,
  })
  return instance
    .post('', {
      longDynamicLink: getLongLink(recipeId, recipeName),
      suffix: {
        option: 'SHORT',
      },
    })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return [response.data, null]
      }
      return [null, 'error']
    })
    .catch(function(error) {
      return [null, error]
    })
}

function createSharedRecipeHandler(req, res) {
  const db = getDb()
  const collection = db.collection('mixxy_shared_recipes')

  if (
    req.swagger.params.body.value.device_token === undefined ||
    req.swagger.params.body.value.device_token === ''
  ) {
    res.status(500)
    res.json('No device token passed')
  }

  // Check with apple about valid device
  const jwtToken = jwt.sign(
    { iss: 'K78F8G9J87', iat: Math.floor(Date.now() / 1000) },
    process.env.APPLE_PRIVATE_KEY,
    { algorithm: 'ES256', header: { kid: process.env.APPLE_KEY_ID } }
  )
  const instance = axios.create({
    baseURL: process.env.APPLE_URL,
    timeout: 1000,
    headers: { Authorization: `Bearer ${jwtToken}` },
  })
  instance
    .post('', {
      device_token: req.swagger.params.body.value.device_token,
      transaction_id: uuidv4(),
      timestamp: Date.now(),
    })
    .then(function(response) {
      if (response.status !== 200) {
        res.status(500)
        res.json('Invalid device')
      }
      // Get db doc
      const dbDoc = getMixxyRecipeDoc(req.swagger.params.body.value, '1.0.1')
      const recipeID = req.swagger.params.recipeID.value
      collection.findOne({ recipe_id: recipeID }, (err, item) => {
        if (err) {
          res.status(500)
          res.json(err)
        } else if (!item) {
          getShortenedLink(recipeID, dbDoc.recipe_name).then(function(response) {
            if (response[1]) {
              res.status(500)
              res.json('Error occurred while generating link')
            } else {
              dbDoc.short_link = response[0].shortLink
              collection.insertOne(dbDoc, (err2) => {
                if (err2) {
                  res.status(500)
                  res.json(err)
                } else {
                  res.status(201)
                  res.json(dbDoc.short_link)
                }
              })
            }
          })
        } else if (item.short_link) {
          const newValues = { $set: dbDoc }
          collection.updateOne({ recipe_id: recipeID }, newValues, (err2, dbRes) => {
            if (err2) {
              res.status(500)
              res.json(err2)
            } else {
              res.status(201)
              res.json(item.short_link)
            }
          })
        } else {
          getShortenedLink(recipeID, dbDoc.recipe_name).then(function(response) {
            if (response[1]) {
              res.status(500)
              res.json('Error occurred while generating link')
            } else {
              dbDoc.short_link = response[0].shortLink
              const newValues = { $set: dbDoc }
              collection.updateOne({ recipe_id: recipeID }, newValues, (err2, dbRes) => {
                if (err2) {
                  res.status(500)
                  res.json(err2)
                } else {
                  res.status(201)
                  res.json(dbDoc.short_link)
                }
              })
            }
          })
        }
      })
    })
    .catch(() => {
      res.status(500)
      res.json('Error occurred')
    })
}

module.exports = {
  createMixxyRecipe: createRecipeHandler,
  getMixxyRecipes: getRecipesHandler,
  getMixxyRecipe: getRecipeDetailsHandler,
  createSharedMixxyRecipe: createSharedRecipeHandler,
}
