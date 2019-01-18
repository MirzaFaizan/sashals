var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var en = require('./multi-language/en.json');
var th = require('./multi-language/th.json');
var ru = require('./multi-language/ru.json');


router.get('/', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    db.collection('offers').find({}).sort({ "$natural": -1 }).limit(3).toArray((err, offers) => {
      db.collection('requests').find({}).sort({ "$natural": -1 }).limit(3).toArray((err, requests) => {
        db.collection('users').find({}).toArray((err, users) => {
          db.collection('categories').find({}).toArray((err, categories) => {
            db.collection("sites").find({}).toArray((err, site) => {
              res.render('index', {
                title: site[0].title+' - Home',
                show: 'home',
                userData: users,
                offers: offers,
                categories: categories,
                requests: requests,
                sites: site
              });
            });
          })
        });
      });
    });
  });
});

router.get('/register', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    db.collection('categories').find({}).toArray((err, categories) => {
      db.collection("sites").find({}).toArray((err, site) => {
        res.render('index', {
          title: site[0].title+' - Registration',
          show: 'register',
          categories: categories,
          sites: site
        });
      });
    })
  });
});

router.get('/multi-language', (req, res) => {
  if(req.query.id == 'English') {
    res.send(en);
  }else if(req.query.id == 'Russian') {
    res.send(ru);
  }else if(req.query.id == 'Thai') {
    res.send(th);
  }
})

router.get('/test', (req, res) => {
  res.render('test');
})


module.exports = router;
