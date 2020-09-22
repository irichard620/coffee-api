const uuidv4 = require('uuid/v4')

function getBeanDoc(beanModel) {
  const dbDoc = {}
  if (!beanModel.bean_id) {
    dbDoc.bean_id = uuidv4()
  } else {
    dbDoc.bean_id = beanModel.bean_id
  }
  dbDoc.sponsor_id = beanModel.sponsor_id || ''
  dbDoc.bean_link = beanModel.bean_link || ''
  dbDoc.title = beanModel.title || ''
  dbDoc.description = beanModel.description || ''
  dbDoc.status = beanModel.status || 'ACTIVE'
  return dbDoc
}

module.exports = getBeanDoc
