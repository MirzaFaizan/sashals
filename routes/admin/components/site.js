var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const multer = require('multer')
const fs = require('fs');

const config = require('../../../config');

router.use(function(req, res, next) {
  if(req.session.adminId == undefined) {
    res.redirect("/admin/login")
  }else {
    next();
  }
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/logos');
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

router.get('/', function(req, res, next) {
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('sites');
    collection.find({}).toArray((err, result) => {
      db.collection("sites").find({}).toArray((err, site) => {
      if(result[0]) {
        try {
          res.render('admin/index', {
            title: site[0].title+' - Admin Site Setting',
            logo: site[0].image,
            show: 'siteSetting',
            header: result[0].title,
            footer: site[0].title
          });
        }catch(err) {
          res.render('admin/index', {
            title: 'Blog - Admin Site Setting',
            logo: 'vFR1Q.png',
            show: 'siteSetting',
            header: result[0].title,
            footer: 'Blog'
          });
        }
      }else {
        try {
          res.render('admin/index', {
            title: site[0].title+' - Admin Site Setting',
            logo: site[0].image,
            show: 'siteSetting',
            header: '',
            footer: site[0].title
          });
        }catch(err) {
          res.render('admin/index', {
            title: 'Blog - Admin Site Setting',
            logo: 'vFR1Q.png',
            show: 'siteSetting',
            header: '',
            footer: 'Blog'
          });
        }
      }
    });
    })
  });
});

router.post('/change', upload.single('image'), function(req, res, next) {
  let title = req.body.title;
  try {
    let image = req.file.originalname;
    MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
      const collection = db.collection('sites');
      collection.find({}).toArray((err, result) => {
        console.log(result[0]);
        if(!result[0]) {
          collection.insertOne({title,image,created_date: new Date()}, (err, result) => {
            res.redirect('/admin/site');
          });
        }else {
          collection.update({}, {
            $set: {
              title,
              image,
              created_date: new Date()
            }
          }, (err, result) => {
            res.redirect('/admin/site');
          });
        }
      });
    });
  }catch(err) {
    MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
      const collection = db.collection('sites');
      collection.find({}).toArray((err, result) => {
        if(!result[0]) {
          collection.insertOne({title,created_date: new Date()}, (err, result) => {
            res.redirect('/admin/site');
          })
        }else {
          collection.update({}, {
            $set: {
              title,
              created_date: new Date()
            }
          }, (err, result) => {
            res.redirect('/admin/site');
          });
        }
      });
    });
  }
});

module.exports = router;
