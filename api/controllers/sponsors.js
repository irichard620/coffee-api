const { getDb } = require('../db/db')
const getSponsorDoc = require('../db/sponsor')

function getSponsorsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('sponsors')
  collection
    .find({ status: 'ACTIVE' })
    .sort({ priority: 1 })
    .toArray((err, items) => {
      if (err) {
        res.status(500)
        res.json(err)
      } else {
        res.status(200)
        res.json(items)
      }
    })
}

function getSponsorHandler(req, res) {
  const db = getDb()
  const sponsorCollection = db.collection('sponsors')
  const beanCollection = db.collection('beans')
  const recipeCollection = db.collection('recipes')

  const sponsorID = req.swagger.params.sponsorID.value
  sponsorCollection.findOne({ sponsor_id: sponsorID }, (err, item) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else if (!item) {
      res.status(404)
      res.json('Not found!')
    } else {
      // Now, get beans
      const sponsorItem = getSponsorDoc(item)
      beanCollection
        .find({ sponsor_id: sponsorID, status: 'ACTIVE' })
        .toArray((err2, beanItems) => {
          if (err2) {
            res.status(500)
            res.json(err2)
          } else {
            sponsorItem.beans = beanItems
            // Now, get recipes
            recipeCollection
              .find({ sponsor_id: sponsorID, status: 'ACTIVE' })
              .toArray((err3, recipeItems) => {
                if (err3) {
                  res.status(500)
                  res.json(err3)
                } else {
                  sponsorItem.recipes = recipeItems
                  res.status(200)
                  res.json(sponsorItem)
                }
              })
          }
        })
    }
  })
}

function createSponsorHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  const collection = db.collection('sponsors')
  const dbDoc = getSponsorDoc(req.swagger.params.body.value)
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(201)
      res.json('Successfully created sponsor')
    }
  })
}

module.exports = {
  getSponsors: getSponsorsHandler,
  createSponsor: createSponsorHandler,
  getSponsor: getSponsorHandler,
}
