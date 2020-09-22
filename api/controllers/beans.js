const { getDb } = require('../db/db')
const getBeanDoc = require('../db/bean')

function createBeanHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401)
    res.json('Not an admin user')
    return
  }
  const db = getDb()
  const collection = db.collection('beans')
  const dbDoc = getBeanDoc(req.swagger.params.body.value)
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500)
      res.json(err)
    } else {
      res.status(201)
      res.json('Successfully created bean')
    }
  })
}

module.exports = {
  createBean: createBeanHandler,
}
