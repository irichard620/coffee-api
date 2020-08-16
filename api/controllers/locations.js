const { getDb } = require('../db/db')
const getLocationDoc = require('../db/location')

function createLocationHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  const collection = db.collection('locations')
  const dbDoc = getLocationDoc(req.swagger.params.body.value)
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(201)
      res.json('Successfully created location')
    }
  })
}

function getSponsorLocationsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('locations')
  const sponsorID = req.swagger.params.sponsorID.value
  if (!sponsorID || sponsorID === '') {
    res.status(400)
    res.json('Must pass sponsor ID in url')
    return
  }
  collection.find({ sponsor_id: sponsorID }).toArray((err, locationItems) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(200)
      res.json(locationItems)
    }
  })
}

function getAllLocationsHandler(req, res) {
  const db = getDb()
  const collection = db.collection('locations')
  collection.find({}).toArray((err, locationItems) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(200)
      res.json(locationItems)
    }
  })
}

module.exports = {
  createLocation: createLocationHandler,
  getSponsorLocations: getSponsorLocationsHandler,
  getAllLocations: getAllLocationsHandler,
}
