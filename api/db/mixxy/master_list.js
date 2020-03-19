const uuidv4 = require('uuid/v4');

function getMasterListDoc(masterListModel) {
  const dbDoc = {};
  if (!masterListModel.master_list_id) {
    dbDoc.master_list_id = uuidv4();
  } else {
    dbDoc.master_list_id = masterListModel.master_list_id;
  }
  dbDoc.name = masterListModel.name || '';
  dbDoc.short_description = masterListModel.short_description || '';
  dbDoc.long_description = masterListModel.long_description || '';
  dbDoc.image_link = masterListModel.image_link || '';
  dbDoc.status = masterListModel.status || 'INACTIVE';
  return dbDoc;
}

module.exports = getMasterListDoc;
