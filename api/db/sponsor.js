const uuidv4 = require('uuid/v4');

module.exports = getSponsorDoc

function getSponsorDoc(sponsorModel) {
  let dbDoc = {}
  if (!sponsorModel.sponsor_id) {
    dbDoc["sponsor_id"] = uuidv4();
  } else {
    dbDoc["sponsor_id"] = sponsorModel.sponsor_id
  }
  dbDoc["logo_link"] = sponsorModel.logo_link || ""
  dbDoc["background_link"] = sponsorModel.background_link || ""
  dbDoc["company"] = sponsorModel.company
  dbDoc["location"] = sponsorModel.location
  dbDoc["description"] = sponsorModel.description
  dbDoc["status"] = sponsorModel.status
  return dbDoc
}
