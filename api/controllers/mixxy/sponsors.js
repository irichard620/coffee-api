const Sentry = require('@sentry/node')
const { getDb } = require('../../db/db')
const getSponsorDoc = require('../../db/mixxy/sponsor')
const getSponsorCardDoc = require('../../db/mixxy/sponsor_card')

function getSponsorHandler(req, res) {
  const db = getDb()
  const sponsorCollection = db.collection('mixxy_sponsors')

  const sponsorID = req.swagger.params.sponsorID.value
  sponsorCollection.findOne({ sponsor_id: sponsorID }, (err, item) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else if (!item) {
      res.status(404)
      res.json('Not found!')
    } else {
      const sponsorItem = getSponsorDoc(item)
      res.status(200)
      res.json(sponsorItem)
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
  const collection = db.collection('mixxy_sponsors')
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

function createSponsorCardHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  // Check if sponsor exists first
  const sponsorID = req.swagger.params.sponsorID.value
  const sponsorCollection = db.collection('mixxy_sponsors')
  const cardsCollection = db.collection('mixxy_sponsor_cards')
  sponsorCollection.findOne({ sponsor_id: sponsorID }, (err, item) => {
    if (err || !item) {
      res.status(500)
      res.json('Could not find sponsor with id specified')
    } else {
      const dbDoc = getSponsorCardDoc(req.swagger.params.body.value)
      dbDoc.sponsor_id = sponsorID
      cardsCollection.insertOne(dbDoc, (err2) => {
        if (err2) {
          res.status(500)
          res.json(err2)
        } else {
          res.status(201)
          res.json('Successfully created sponsor card')
        }
      })
    }
  })
}

function getSponsorCardsHandler(req, res) {
  const db = getDb()
  const cardsCollection = db.collection('mixxy_sponsor_cards')
  cardsCollection.find({ status: 'ACTIVE' }).toArray((err, items) => {
    if (err) {
      Sentry.captureException(err)
      res.status(500)
      res.json(err)
    } else {
      res.status(200)
      res.json(items)
    }
  })
}

function getSponsorCardDetailsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('mixxy_sponsor_cards')
  const sponsorCardId = req.swagger.params.sponsorCardId.value
  collection.findOne({ card_id: sponsorCardId }, (err, item) => {
    if (err) {
      Sentry.captureException(err)
      res.status(500)
      res.json(err)
    } else if (!item) {
      res.status(404)
      res.json('Not found!')
    } else {
      const sponsorItem = getSponsorCardDoc(item)
      res.status(200)
      res.json(sponsorItem)
    }
  })
}

module.exports = {
  createMixxySponsor: createSponsorHandler,
  createMixxySponsorCard: createSponsorCardHandler,
  getMixxySponsorCards: getSponsorCardsHandler,
  getMixxySponsor: getSponsorHandler,
  getMixxySponsorCardDetails: getSponsorCardDetailsHandler,
}
