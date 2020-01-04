const { getDb } = require('../db/db');
const getVesselDoc = require('../db/vessel');

function createVesselHandler(req, res) {
  if (req.uid !== 'JvhWbWy4mmMkjiB7rGpFjan4q603') {
    res.status(401);
    res.json('Not an admin user');
    return;
  }
  const db = getDb();
  const collection = db.collection('vessels');
  const dbDoc = getVesselDoc(req.swagger.params.body.value);
  collection.insertOne(dbDoc, (err) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(201);
      res.json('Successfully created vessel');
    }
  });
}

function getVesselHandler(req, res) {
  const db = getDb();
  const collection = db.collection('vessels');
  const vesselName = req.swagger.params.vesselName.value;
  if (!vesselName || vesselName === '') {
    res.status(400);
    res.json('Must pass vessel name in url');
    return;
  }
  collection.findOne({ vessel_name: vesselName }, (err, item) => {
    if (err) {
      res.status(500);
      res.json(err);
    } else if (!item) {
      res.status(404);
      res.json('Not found!');
    } else {
      res.status(200);
      res.json(item);
    }
  });
}

module.exports = {
  createVessel: createVesselHandler,
  getVessel: getVesselHandler,
};
