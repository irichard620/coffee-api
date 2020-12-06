const uuidv4 = require('uuid/v4')

function getUserDoc(userModel) {
  const dbDoc = {}
  if (!userModel.user_id) {
    dbDoc.user_id = uuidv4()
  } else {
    dbDoc.user_id = userModel.user_id
  }
  dbDoc.auth_id = userModel.auth_id || ''
  dbDoc.display_name = userModel.display_name || ''
  dbDoc.email = userModel.email || ''
  return dbDoc
}

module.exports = getUserDoc
