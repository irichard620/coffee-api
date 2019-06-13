const assert = require("assert");
const client = require("mongodb").MongoClient;

let _db;

module.exports = {
  getDb,
  initDb
};

function initDb(callback) {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }

  client.connect(process.env.DB_HOST, { useNewUrlParser: true }, connected);
  function connected(err, client) {
    if (err) {
      return callback(err);
    }
    console.log("DB initialized - connected to: " + process.env.DB_HOST.split("@")[1]);
    _db = client.db("coffee");
    return callback(null, _db);
  }
}


function getDb() {
  assert.ok(_db, "Db has not been initialized. Please called init first.");
  return _db;
}
