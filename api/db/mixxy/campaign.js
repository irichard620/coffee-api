const uuidv4 = require('uuid/v4')

function getCampaignDoc(campaignModel) {
  const dbDoc = {}
  if (!campaignModel.campaign_id) {
    dbDoc.campaign_id = uuidv4()
  } else {
    dbDoc.campaign_id = campaignModel.campaign_id
  }
  dbDoc.tags = campaignModel.tags || []
  dbDoc.tag_color = campaignModel.tag_color || ''
  dbDoc.name = campaignModel.name || ''
  dbDoc.short_description = campaignModel.short_description || ''
  dbDoc.long_description = campaignModel.long_description || ''
  dbDoc.image_link = campaignModel.image_link || ''
  dbDoc.status = campaignModel.status || 'INACTIVE'
  return dbDoc
}

module.exports = getCampaignDoc
