var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var bcrypt = require('bcrypt');
var config = require('../config');
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/offer');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/png') {
    cb(null, true);
  }else {
    cb(null, false);
  }
};
var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.get('/view', function(req, res, next) {
  var getObject = {
    _id: new mongodb.ObjectID(req.query.id)
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('offers');
    collection.findOne(getObject, (err, offer) => {
      var getUser = {
        _id: new mongodb.ObjectID(offer.userId)
      }
      db.collection('users').findOne(getUser, (err, user) => {
        db.collection('categories').find({}).toArray((err, categories) => {
          db.collection("sites").find({}).toArray((err, site) => {
            res.render('index', {
              title: site[0].title+' - Offer View',
              show: 'orderView',
              offer: offer,
              userData: user,
              categories: categories,
              sites: site
            });
          });
        });
      })
    })
  })
})

router.use(function(req, res, next) {
  if(req.session.userId == undefined) {
    res.redirect("/login")
  }else {
    next();
  }
})

router.post('/', upload.single('coverImage'), function(req, res, next) {
  var serviceTitle = req.body.serviceTitle;
  var servicePrice = req.body.servicePrice;
  var serviceCurrency = req.body.serviceCurrency;
  var serviceCountry = req.body.serviceCountry;
  var serviceCity = req.body.offerCity;
  var minBatch = req.body.minBatch;
  var maxBatch = req.body.maxBatch;
  var unit = req.body.unit;
  var category = req.body.category;
  var serviceDescription = req.body.serviceDescription;

  try {
    let image = req.file.originalname;
    mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
      const collection = db.collection('offers');
      collection.insertOne({
        title: serviceTitle,
        price: servicePrice,
        currency: serviceCurrency,
        country: serviceCountry,
        city: serviceCity,
        minBatch,
        maxBatch,
        unit,
        category,
        description: serviceDescription,
        image,
        userId: req.session.userId,
        updated_date: "",
        created_date: new Date()
      }, (err, result) => {
        res.redirect('/profile');
      })
    });
  }catch(err) {
    res.redirect('/profile');
  }
});

router.post('/update', upload.single('coverImage'), function(req, res, next) {
  var serviceTitle = req.body.serviceTitle;
  var servicePrice = req.body.servicePrice;
  var serviceCurrency = req.body.serviceCurrency;
  var serviceCountry = req.body.serviceCountry;
  var serviceCity = req.body.offerCity;
  var minBatch = req.body.minBatch;
  var maxBatch = req.body.maxBatch;
  var unit = req.body.unit;
  var category = req.body.category;
  var serviceDescription = req.body.serviceDescription;
  var updateObject = {
    _id : new mongodb.ObjectID(req.query.id)
  }
  try {
    let image = req.file.originalname;
    mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
      const collection = db.collection('offers');
      collection.updateOne(updateObject, {
        $set: {
          title: serviceTitle,
          price: servicePrice,
          currency: serviceCurrency,
          country: serviceCountry,
          city: serviceCity,
          minBatch,
          maxBatch,
          unit,
          category,
          description: serviceDescription,
          image,
          updated_date: new Date()
        }
      }, (err, result) => {
        res.redirect('/offer/view?id='+req.query.id);
      })
    });
  }catch(err) {
    mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
      const collection = db.collection('offers');
      collection.updateOne(updateObject, {
        $set: {
          title: serviceTitle,
          price: servicePrice,
          currency: serviceCurrency,
          country: serviceCountry,
          city: serviceCity,
          minBatch,
          maxBatch,
          unit,
          category,
          description: serviceDescription,
          updated_date: new Date()
        }
      }, (err, result) => {
        res.redirect('/offer/view?id='+req.query.id);
      })
    });
  }
});

router.get('/delete', function(req, res, next) {
  var deleteObject = {
    _id: new mongodb.ObjectID(req.query.id)
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('offers');
    collection.deleteOne(deleteObject, (err, result) => {
      res.redirect('/profile');
    })
  })
});


module.exports = router;
