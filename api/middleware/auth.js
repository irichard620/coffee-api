const admin = require('firebase-admin')

function authMiddleware(req, res, next) {
  // get the token from the header if present
  const token = req.headers['x-access-token'] || req.headers.authorization

  // if no token found, return response (without going to the next middelware)
  if (!token) {
    req.uid = ''
    return next()
  }

  // if can verify the token, set req.user and pass to next middleware
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.uid = decodedToken.uid
      return next()
    })
    .catch(() => {
      // Handle error
      res.statusCode = 500
      return res.end('Internal server error')
    })
}

module.exports = authMiddleware
