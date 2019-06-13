const uuidv4 = require('uuid/v4');

module.exports = getSponsorDoc

function getSponsorDoc(sponsorModel) {
  let dbDoc = {}
  if (!sponsorModel._id) {
    dbDoc["_id"] = uuidv4();
  }
  dbDoc["logo_link"] = sponsorModel.logo_link || ""
  dbDoc["company"] = sponsorModel.company
  dbDoc["location"] = sponsorModel.location
  dbDoc["description"] = sponsorModel.description
  dbDoc["status"] = sponsorModel.status
  return dbDoc
}
