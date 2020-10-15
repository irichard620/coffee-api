const Sentry = require('@sentry/node')
const { getDb } = require('../../db/db')
const getMasterListDoc = require('../../db/mixxy/master_list')

function createMasterListHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  const collection = db.collection('mixxy_master_lists')
  const dbDoc = getMasterListDoc(req.swagger.params.body.value)
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(201)
      res.json('Successfully created master list')
    }
  })
}

function getMasterListsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('mixxy_master_lists')
  collection.find({ status: 'ACTIVE' }).toArray((err, items) => {
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
  createMixxyMasterList: createMasterListHandler,
  getMixxyMasterLists: getMasterListsHandler,
}
