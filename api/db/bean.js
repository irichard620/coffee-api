const uuidv4 = require('uuid/v4');

module.exports = getBeanDoc

function getBeanDoc(beanModel) {
  let dbDoc = {}
  if (!beanModel._id) {
    dbDoc["_id"] = uuidv4();
  }
  dbDoc["sponsor_id"] = beanModel.sponsor_id
  dbDoc["image_link"] = beanModel.image_link || ""
  dbDoc["title"] = beanModel.title
  dbDoc["description"] = beanModel.description
  dbDoc["status"] = beanModel.status
  return dbDoc
}
