const uuidv4 = require('uuid/v4');

function getLocationDoc(locationModel) {
  const dbDoc = {};
  if (!locationModel.location_id) {
    dbDoc.location_id = uuidv4();
  } else {
    dbDoc.location_id = locationModel.location_id;
  }
  dbDoc.sponsor_id = locationModel.sponsor_id || '';
  dbDoc.location_name = locationModel.location_name || '';
  dbDoc.location_description = locationModel.location_description || '';
  dbDoc.latitude = locationModel.latitude || 0;
  dbDoc.longitude = locationModel.longitude || 0;
  return dbDoc;
}

module.exports = getLocationDoc;
