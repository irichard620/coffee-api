const assert = require('assert');
const client = require('mongodb').MongoClient;

// eslint-disable-next-line no-underscore-dangle
let _db;

// eslint-disable-next-line consistent-return
function initDb(callback) {
  if (_db) {
    // eslint-disable-next-line no-console
    console.warn('Trying to init DB again!');
    return callback(null, _db);
  }
  function connected(err, clientToUse) {
    if (err) {
      return callback(err);
    }
    // eslint-disable-next-line no-console
    console.log(`DB initialized - connected to: ${process.env.DB_HOST.split('@')[1]}`);
    _db = clientToUse.db('coffee');
    return callback(null, _db);
  }

  client.connect(process.env.DB_HOST, { useNewUrlParser: true }, connected);
}


function getDb() {
  assert.ok(_db, 'Db has not been initialized. Please called init first.');
  return _db;
}

module.exports = {
  getDb,
  initDb,
};
