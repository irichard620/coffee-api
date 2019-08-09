var admin = require('firebase-admin');

module.exports = function(req, res, next) {
  // Only check if post call
  if (req.method != "POST") {
    return next();
  }

  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  //if no token found, return response (without going to the next middelware)
  if (!token) {
    res.statusCode = 401;
    return res.end("Access denied. No token provided.");
  }

  try {
    //if can verify the token, set req.user and pass to next middleware
    admin.auth().verifyIdToken(token)
      .then(function(decodedToken) {
        req.uid = decodedToken.uid;
        next();
      }).catch(function(error) {
        // Handle error
        res.statusCode = 500;
        res.end("Internal server error");
      });
  } catch (ex) {
    //if invalid token
    res.statusCode = 400;
    res.end("Invalid token.");
  }
};