const uuidv4 = require('uuid/v4')

function getVesselDoc(vesselModel) {
  const dbDoc = {}
  if (!vesselModel.vessel_id) {
    dbDoc.vessel_id = uuidv4()
  } else {
    dbDoc.vessel_id = vesselModel.vessel_id
  }
  dbDoc.vessel_name = vesselModel.vessel_name || ''
  dbDoc.vessel_link = vesselModel.vessel_link || ''
  dbDoc.vessel_description = vesselModel.vessel_description || ''
  return dbDoc
}

module.exports = getVesselDoc
