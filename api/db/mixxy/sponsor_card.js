const uuidv4 = require('uuid/v4');

function getSponsorCardDoc(cardModel) {
  const dbDoc = {};
  if (!cardModel.card_id) {
    dbDoc.card_id = uuidv4();
  } else {
    dbDoc.card_id = cardModel.card_id;
  }
  dbDoc.sponsor_id = cardModel.sponsor_id || '';
  dbDoc.tags = cardModel.tags || [];
  dbDoc.card_image_link = cardModel.card_image_link || '';
  dbDoc.card_title = cardModel.card_title || '';
  dbDoc.status = cardModel.status || 'INACTIVE';
  return dbDoc;
}

module.exports = getSponsorCardDoc;
