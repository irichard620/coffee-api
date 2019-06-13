'use strict';

const getDb = require("../db/db").getDb;
const getSponsorDoc = require("../db/sponsor");

module.exports = {
  getSponsors: getSponsors,
  createSponsor: createSponsor,
  getSponsor: getSponsor,
};

function getSponsors(req, res) {
  const db = getDb();
  const collection = db.collection('sponsors');
  collection.find({status: 'ACTIVE'}).toArray((err, items) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json(err);
    } else {
      console.log(items);
      res.status(200);
      res.json(items);
    }
  });
}

function getSponsor(req, res) {
  const db = getDb();
  const collection = db.collection('sponsors');
  collection.findOne({_id: req.swagger.params.sponsorID.value}, (err, item) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json(err);
    } else if (!item) {
      console.log("Sponsor with ID not found: " + req.swagger.params.sponsorID.value);
      res.status(404);
      res.json("Not found!");
    } else {
      console.log(item);
      res.status(200);
      res.json(item);
    }
  });
}

function createSponsor(req, res) {
  const db = getDb();
  const collection = db.collection('sponsors');
  const dbDoc = getSponsorDoc(req.swagger.params.body.value);
  collection.insertOne(dbDoc, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(201);
      res.json("Successfully created sponsor")
    }
  });
}
