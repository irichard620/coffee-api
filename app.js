const SwaggerConnect = require('swagger-connect')
const Sentry = require('@sentry/node')
require('@sentry/tracing')
require('dotenv').config()
const admin = require('firebase-admin')
const app = require('connect')()
const { initDb } = require('./api/db/db')
const authMiddleware = require('./api/middleware/auth')

module.exports = app // for testing

const config = {
  appRoot: __dirname, // required config
}

const firebaseConfig = {
  apiKey: 'AIzaSyBIzSlQna3kG02vBcN5WFXBQrFjk64GH5k',
  authDomain: 'mixxy-90fce.firebaseapp.com',
  databaseURL: 'https://mixxy-90fce.firebaseio.com',
  projectId: 'mixxy-90fce',
  storageBucket: 'mixxy-90fce.appspot.com',
  messagingSenderId: '205781924664',
  appId: '1:205781924664:web:31b50952bf8b0658395fcd',
  measurementId: 'G-TPVW7CYSRJ',
}

Sentry.init({
  dsn: 'https://323d41c126da4edca4a59221e23a37a1@o461755.ingest.sentry.io/5463980',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

// Initialize Firebase
admin.initializeApp(firebaseConfig)

SwaggerConnect.create(config, (err, swaggerConnect) => {
  if (err) {
    throw err
  }

  // install middleware
  app.use('/beans', authMiddleware)
  app.use('/recipes', authMiddleware)
  app.use('/sponsors', authMiddleware)
  app.use('/vessels', authMiddleware)
  app.use('/locations', authMiddleware)
  app.use('/mixxy', authMiddleware)
  swaggerConnect.register(app)

  const port = process.env.PORT || 10010

  initDb((err2) => {
    if (err2) {
      throw err2
    }
    app.listen(port, (err3) => {
      if (err3) {
        throw err3
      }
    })
  })
})
