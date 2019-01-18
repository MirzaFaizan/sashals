var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../../config');

router.use(function(req, res, next) {
  if(req.session.adminId == undefined) {
    res.redirect("/admin/login")
  }else {
    next();
  }
})

router.get('/', function(req, res, next) {
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    db.collection("sites").find({}).toArray((err, site) => {
      try {
        res.render('admin/index', {
          title: site[0].title+' - Admin Dashboard',
          logo: site[0].image,
          show: 'dashboard',
          footer: site[0].title
        });
      }catch(err) {
        res.render('admin/index', {
          title: 'Blog - Admin Dashboard',
          logo: 'vFR1Q.png',
          show: 'dashboard',
          footer: 'Blog'
        });
      }
    });
  });
});

module.exports = router;
