var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');

router.get('/', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    db.collection('offers').find({}).toArray((err, offers) => {
      db.collection('requests').find({}).toArray((err, requests) => {
        db.collection('users').find({}).toArray((err, users) => {
          db.collection('categories').find({}).toArray((err, categories) => {
            db.collection("sites").find({}).toArray((err, site) => {
              res.render('index', {
                title: site[0].title+' - Category View',
                show: 'categoryView',
                userData: users,
                offers: offers,
                categories: categories,
                sites: site,
                requests: requests
              });
            });
          })
        });
      });
    });
  });
});

router.get('/:categoryName', function(req, res, next) {
  var categoryName = decodeURIComponent(req.params.categoryName);
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    db.collection('offers').find({category: categoryName}).toArray((err, offers) => {
      db.collection('requests').find({category: categoryName}).toArray((err, requests) => {
        db.collection('users').find({}).toArray((err, users) => {
          db.collection('categories').find({}).toArray((err, categories) => {
            db.collection("sites").find({}).toArray((err, site) => {
              res.render('index', {
                title: site[0].title+' - Category View',
                show: 'categoryView',
                userData: users,
                offers: offers,
                categories: categories,
                sites: site,
                requests: requests
              });
            });
          })
        });
      });
    });
  });
});

router.post('/filter', function(req, res, next) {
  var country = req.body.searchCountry;
  var currency = req.body.searchCurrency;
  var search;
  if(country == "All countries") {
    if(currency == "All currencies") {
      search = {};
    }else {
      search = {
        currency: currency
      }
    }
  }else {
    if(currency == "All currencies") {
      search = {
        country: country
      };
    }else {
      search = {
        country: country,
        currency: currency
      }
    }
  }
  console.log(search);
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    db.collection('offers').find(search).toArray((err, offers) => {
      db.collection('requests').find(search).toArray((err, requests) => {
        db.collection('users').find({}).toArray((err, users) => {
          db.collection('categories').find({}).toArray((err, categories) => {
            db.collection("sites").find({}).toArray((err, site) => {
              res.render('index', {
                title: site[0].title+' - Category View',
                show: 'categoryView',
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

module.exports = router;
