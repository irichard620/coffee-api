const uuidv4 = require('uuid/v4')

function getSponsorDoc(sponsorModel) {
  const dbDoc = {}
  if (!sponsorModel.sponsor_id) {
    dbDoc.sponsor_id = uuidv4()
  } else {
    dbDoc.sponsor_id = sponsorModel.sponsor_id
  }
  dbDoc.sponsor_name = sponsorModel.sponsor_name || ''
  dbDoc.sponsor_type = sponsorModel.sponsor_type || ''
  dbDoc.hq_location = sponsorModel.hq_location || ''
  dbDoc.website = sponsorModel.website || ''
  dbDoc.about = sponsorModel.about || ''
  dbDoc.logo_link = sponsorModel.logo_link || ''
  return dbDoc
}

module.exports = getSponsorDoc
