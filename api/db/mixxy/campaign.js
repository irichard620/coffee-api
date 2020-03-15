const uuidv4 = require('uuid/v4');

function getCampaignDoc(campaignModel) {
  const dbDoc = {};
  if (!campaignModel.campaign_id) {
    dbDoc.campaign_id = uuidv4();
  } else {
    dbDoc.campaign_id = campaignModel.campaign_id;
  }
  dbDoc.tags = campaignModel.tags || [];
  dbDoc.campaign_name = campaignModel.campaign_name || '';
  dbDoc.campaign_short_description = campaignModel.campaign_short_description || '';
  dbDoc.campaign_long_description = campaignModel.campaign_long_description || '';
  dbDoc.campaign_image_link = campaignModel.campaign_image_link || '';
  dbDoc.status = campaignModel.status || 'INACTIVE';
  return dbDoc;
}

module.exports = getCampaignDoc;
