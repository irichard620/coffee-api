const uuidv4 = require('uuid/v4');

module.exports = getBeanDoc

function getBeanDoc(beanModel) {
  let dbDoc = {}
  if (!beanModel.bean_id) {
    dbDoc["bean_id"] = uuidv4();
  } else {
    dbDoc["bean_id"] = beanModel.bean_id
  }
  dbDoc["sponsor_id"] = beanModel.sponsor_id
  dbDoc["title"] = beanModel.title
  dbDoc["description"] = beanModel.description
  dbDoc["status"] = beanModel.status
  return dbDoc
}
