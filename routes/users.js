var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var bcrypt = require('bcrypt');
var config = require('../config');

router.get('/profile', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    findUser(db, req.query.id, (user) => {
      db.collection('offers').find({userId: req.query.id}).toArray((err, offer) => {
        db.collection('requests').find({userId: req.query.id}).toArray((err, request) => {
          db.collection('categories').find({}).toArray((err, categories) => {
            db.collection("sites").find({}).toArray((err, site) => {
              res.render('index', {
                title: site[0].title+' - User',
                show: 'user',
                userData: user[0],
                offers: offer,
                requests: request,
                categories: categories,
                sites: site
              });
            });
          })
        });
      });
    });
  });
});

const findUser = (db, userId, callback) => {
  const collection = db.collection('users');
  const findObject = {
    _id: new mongodb.ObjectID(userId)
  }
  collection.find(findObject).toArray((err, result) => {
    callback(result);
  });
}

module.exports = router;
