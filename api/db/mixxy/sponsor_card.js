const uuidv4 = require('uuid/v4');

function getSponsorCardDoc(cardModel) {
  const dbDoc = {};
  if (!cardModel.card_id) {
    dbDoc.card_id = uuidv4();
  } else {
    dbDoc.card_id = cardModel.card_id;
  }
  dbDoc.sponsor_id = cardModel.sponsor_id || '';
  dbDoc.sponsor_name = cardModel.sponsor_name || '';
  dbDoc.sponsor_type = cardModel.sponsor_type || '';
  dbDoc.hq_location = cardModel.hq_location || '';
  dbDoc.website = cardModel.website || '';
  dbDoc.about = cardModel.about || '';
  dbDoc.logo_link = cardModel.logo_link || '';
  dbDoc.tags = cardModel.tags || [];
  dbDoc.tag_color = cardModel.tag_color || '';
  dbDoc.card_image_link = cardModel.card_image_link || '';
  dbDoc.card_title = cardModel.card_title || '';
  dbDoc.status = cardModel.status || 'INACTIVE';
  return dbDoc;
}

module.exports = getSponsorCardDoc;
