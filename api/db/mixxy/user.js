const uuidv4 = require('uuid/v4')

function getUserDoc(userModel) {
  const dbDoc = {}
  if (!userModel.user_id) {
    dbDoc.user_id = uuidv4()
  } else {
    dbDoc.user_id = userModel.user_id
  }
  dbDoc.auth_id = userModel.auth_id || ''
  if (userModel.display_name) {
    dbDoc.display_name = userModel.display_name.toLowerCase()
  } else {
    dbDoc.display_name = ''
  }
  if (userModel.full_name) {
    dbDoc.full_name = userModel.full_name
  } else {
    dbDoc.full_name = ''
  }
  if (userModel.email) {
    dbDoc.email = userModel.email.toLowerCase()
  } else {
    dbDoc.email = ''
  }
  return dbDoc
}

module.exports = getUserDoc
