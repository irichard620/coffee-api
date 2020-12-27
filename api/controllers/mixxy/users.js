const Sentry = require('@sentry/node')
const Filter = require('bad-words')
const { getDb } = require('../../db/db')
const getUserDoc = require('../../db/mixxy/user')

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
      let displayName = req.swagger.params.body.value.display_name

      // Check for profanity
      if (filter.isProfane(displayName)) {
        res.status(400)
        res.json('Profanity')
        return
      }

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

module.exports = {
  createUser: createUserHandler,
}
