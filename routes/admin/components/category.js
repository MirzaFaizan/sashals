var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const config = require('../../../config');

router.use(function(req, res, next) {
  if(req.session.adminId == undefined) {
    res.redirect("/admin/login")
  }else {
    next();
  }
})

router.get('/add', function(req, res, next) {
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    db.collection("sites").find({}).toArray((err, site) => {
      try {
        res.render('admin/index', {
          title: site[0].title+' - Admin Category',
          logo: site[0].image,
          show: 'addCategory',
          footer: site[0].title
        });
      }catch(err) {
        res.render('admin/index', {
          title: 'Blog - Admin Category',
          logo: 'vFR1Q.png',
          show: 'addCategory',
          footer: 'Blog'
        });
      }
    });
  });
});

router.post('/add', function(req, res, next) {
  const name = req.body.categoryName;
  let response = {};

  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);

    saveCategory(db, name, (category) => {
      if(!category) {
        response.success = false;
        response.message = 'Something wents wrong in server';
        return res.send(response);
      }
      response.success = true;
      response.message = 'Successfully Saved Category';
      res.send(response);
    })
  });
});

router.get('/view', function(req, res, next) {
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('categories');
    collection.find({}).toArray((err, result) => {
      db.collection("sites").find({}).toArray((err, site) => {
        try {
          res.render('admin/index', {
            title: site[0].title+' - Admin Category',
            logo: site[0].image,
            show: 'viewCategory',
            category: result,
            footer: site[0].title
          });
        }catch(err) {
          res.render('admin/index', {
            title: 'Blog - Admin Category',
            logo: 'vFR1Q.png',
            show: 'viewCategory',
            category: result,
            footer: 'Blog'
          });
        }
      });
    })
  });
});

router.get('/delete', function(req, res, next) {
  const categoryId  = req.query.id;

  let deleteObject = {
    _id: new mongodb.ObjectID(categoryId)
  }
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('categories');
    collection.deleteOne(deleteObject, (err, result) => {
      res.redirect('/admin/category/view');
    })
  });
});

const saveCategory = (db, name, callback) => {
  const collection = db.collection('categories');
  collection.insertOne({
    name,
    created_date: new Date()
  }, (err, result) => {
    callback(result);
  })
}

module.exports = router;
