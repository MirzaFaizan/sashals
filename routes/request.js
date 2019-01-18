var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var bcrypt = require('bcrypt');
var config = require('../config');

router.get('/view', function(req, res, next) {
  var getObject = {
    _id: new mongodb.ObjectID(req.query.id)
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('requests');
    collection.findOne(getObject, (err, request) => {
      var getUser = {
        _id: new mongodb.ObjectID(request.userId)
      }
      db.collection('users').findOne(getUser, (err, user) => {
        db.collection('categories').find({}).toArray((err, categories) => {
          db.collection("sites").find({}).toArray((err, site) => {
            res.render('index', {
              title: site[0].title+' - View Request',
              show: 'viewRequest',
              requestData: request,
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

router.post('/create', function(req, res, next) {
  var title = req.body.title;
  var price = req.body.price;
  var currency = req.body.currency;
  var country = req.body.country;
  var city = req.body.city;
  var minBatch = req.body.minBatch;
  var maxBatch = req.body.maxBatch;
  var unit = req.body.unit;
  var category = req.body.category;
  var description = req.body.description;

  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('requests');
    collection.insertOne({
      title,
      price,
      currency,
      country,
      city,
      minBatch,
      maxBatch,
      unit,
      category,
      description,
      userId: req.session.userId,
      updated_date: "",
      created_date: new Date()
    }, (err, result) => {
      res.redirect('/profile');
    })
  });
});

router.get('/delete', function(req, res, next) {
  var deleteObject = {
    _id: new mongodb.ObjectID(req.query.id)
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('requests');
    collection.deleteOne(deleteObject, (err, result) => {
      res.redirect('/profile');
    })
  })
});

router.get('/edit', function(req, res, next) {
  var getObject = {
    _id: new mongodb.ObjectID(req.query.id)
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('requests');
    collection.findOne(getObject, (err, request) => {
      var getUser = {
        _id: new mongodb.ObjectID(request.userId)
      }
      db.collection('users').findOne(getUser, (err, user) => {
        db.collection('categories').find({}).toArray((err, categories) => {
          db.collection("sites").find({}).toArray((err, site) => {
            res.render('index', {
              title: site[0].title+' - Edit Request',
              show: 'editRequest',
              requestData: request,
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

router.post('/update', function(req, res, next) {
  var title = req.body.title;
  var price = req.body.price;
  var currency = req.body.currency;
  var country = req.body.country;
  var city = req.body.city;
  var minBatch = req.body.minBatch;
  var maxBatch = req.body.maxBatch;
  var unit = req.body.unit;
  var category = req.body.category;
  var description = req.body.description;
  var updateObject = {
    _id : new mongodb.ObjectID(req.query.id)
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('requests');
    collection.updateOne(updateObject,
      {
        $set: {
          title,
          price,
          currency,
          country,
          city,
          minBatch,
          maxBatch,
          unit,
          category,
          description,
          updated_date: "new Date()"
        }
      }, (err, result) => {
        res.redirect('/request/view?id='+req.query.id);
    })
  });
});

module.exports = router;
