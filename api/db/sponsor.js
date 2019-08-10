const uuidv4 = require('uuid/v4');

module.exports = getSponsorDoc

function getSponsorDoc(sponsorModel) {
  let dbDoc = {}
  if (!sponsorModel.sponsor_id) {
    dbDoc["sponsor_id"] = uuidv4();
  } else {
    dbDoc["sponsor_id"] = sponsorModel.sponsor_id
  }
  dbDoc["image_link"] = sponsorModel.image_link || ""
  dbDoc["company"] = sponsorModel.company
  dbDoc["location"] = sponsorModel.location
  dbDoc["street_address"] = sponsorModel.street_address
  dbDoc["latitude"] = sponsorModel.latitude
  dbDoc["longitude"] = sponsorModel.longitude
  dbDoc["visit_description"] = sponsorModel.visit_description
  dbDoc["description"] = sponsorModel.description
  dbDoc["theme_color"] = sponsorModel.theme_color
  dbDoc["text_color"] = sponsorModel.text_color
  dbDoc["status"] = sponsorModel.status
  return dbDoc
}
