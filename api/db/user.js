const uuidv4 = require('uuid/v4');

function getUserDoc(authID) {
  const dbDoc = {};
  dbDoc.user_id = uuidv4();
  dbDoc.auth_id = authID;
  dbDoc.name = 'Drippy User';
  dbDoc.last_backup = null;
  return dbDoc;
}

module.exports = getUserDoc;
