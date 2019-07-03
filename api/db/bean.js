const uuidv4 = require('uuid/v4');

module.exports = getBeanDoc

function getBeanDoc(beanModel) {
  let dbDoc = {}
  if (!beanModel.id) {
    dbDoc["_id"] = uuidv4();
  } else {
    dbDoc["_id"] = beanModel.id
  }
  dbDoc["sponsor_id"] = beanModel.sponsor_id
  dbDoc["image_link"] = beanModel.image_link || ""
  dbDoc["title"] = beanModel.title
  dbDoc["description"] = beanModel.description
  dbDoc["status"] = beanModel.status
  return dbDoc
}
