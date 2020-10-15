const Sentry = require('@sentry/node')
const { getDb } = require('../../db/db')
const getCampaignDoc = require('../../db/mixxy/campaign')

function createCampaignHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  const collection = db.collection('mixxy_campaigns')
  const dbDoc = getCampaignDoc(req.swagger.params.body.value)
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(201)
      res.json('Successfully created campaign')
    }
  })
}

function getCampaignsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('mixxy_campaigns')
  collection
    .find({ status: 'ACTIVE' })
    .sort({ order: 1 })
    .toArray((err, items) => {
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

module.exports = {
  createMixxyCampaign: createCampaignHandler,
  getMixxyCampaigns: getCampaignsHandler,
}
