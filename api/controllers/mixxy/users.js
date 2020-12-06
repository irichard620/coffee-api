const Sentry = require('@sentry/node')
const { getDb } = require('../../db/db')
const getUserDoc = require('../../db/mixxy/user')

async function createUserHandler(req, res) {
  try {
    const db = getDb()
    const collection = db.collection('mixxy_users')

    // Use email to check if user exists
    const email = req.swagger.params.body.value.email || ''
    const existingUser = await collection.findOne({ email: email })

    // If no user, create with email and display name
    if (!existingUser) {
      const displayName = req.swagger.params.body.value.display_name
      if (!displayName) {
        res.status(400)
        res.json('Missing display name')
        return
      }
      // Make sure display name unique
      const existingDisplayName = await collection.findOne({ display_name: displayName })
      if (existingDisplayName) {
        res.status(409)
        res.json('Display name conflict')
        return
      }
      // Create user
      const userItem = getUserDoc(req.swagger.params.body.value)
      const newUser = await collection.insertOne(userItem)
      res.status(201)
      res.json(newUser)
    } else {
      if (existingUser.auth_id && existingUser.auth_id !== req.uid) {
        res.status(409)
        res.json('Email conflict')
        return
      }
      // If user, check if auth_id exists
      if (!req.uid || req.uid === '') {
        res.status(400)
        res.json('Missing auth id')
        return
      }
      // If auth id already, return
      if (existingUser.auth_id) {
        // Return
        res.status(201)
        res.json(getUserDoc(existingUser))
        return
      }
      // Update auth_id if doesn't exist
      const newValues = { $set: { auth_id: req.uid } }
      const updatedUser = await collection.updateOne({ email: email }, newValues)
      res.status(201)
      res.json(getUserDoc(updatedUser))
      return
    }
  } catch (err) {
    Sentry.captureException(err)
    res.status(500)
    res.json(err)
  }
}

module.exports = {
  createUser: createUserHandler,
}
