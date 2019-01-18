var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
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
          title: site[0].title+' - Admin Add',
          logo: site[0].image,
          show: 'addAdmin',
          footer: site[0].title
        });
      }catch(err) {
        res.render('admin/index', {
          title: 'Blog - Admin Add',
          logo: 'vFR1Q.png',
          show: 'addAdmin',
          footer: 'Blog'
        });
      }
    });
  });
});

router.post('/add', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const saltRounds = 10;
  let response = {};
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('admins');
    findAdmin(db, email, (admin) => {
      if(admin[0]) {
        response.success = false;
        response.message = 'Email already taken';
        return res.send(response);
      }
      bcrypt.hash(password, saltRounds, function(err, hash) {
        collection.insertOne({username,email,password:hash,question: '',answer: '',image:'',role:1,created_date: new Date()}, (err, result) => {
          if(!result) {
            response.success = false;
            response.message = 'Something wents wrong in server';
            return res.send(response);
          }
          response.success = true;
          response.message = 'Successfully Created Admin';
          res.send(response);
        });
      });
    });
  });
});

router.get('/view', function(req, res, next) {
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('admins');
    collection.find({}).toArray((err, result) => {
      //console.log(result);
      db.collection("sites").find({}).toArray((err, site) => {
        try {
          res.render('admin/index', {
            title: site[0].title+' - Admin Show',
            logo: site[0].image,
            show: 'viewAdmin',
            admin: result,
            footer: site[0].title
          });
        }catch(err) {
          res.render('admin/index', {
            title: 'Blog - Admin Show',
            logo: 'vFR1Q.png',
            show: 'viewAdmin',
            admin: result,
            footer: 'Blog'
          });
        }
      });
    })
  });
});

router.get('/delete', function(req, res, next) {
  const adminId  = req.query.id;

  let deleteObject = {
    _id: new mongodb.ObjectID(adminId)
  }
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('admins');
    collection.deleteOne(deleteObject, (err, result) => {
      res.redirect('/admin/new/view');
    })
  });
});

const findAdmin = (db, email, callback) => {
  const collection = db.collection('admins');
  collection.find({email}).toArray((err, result) => {
    console.log("Found the following records");
    callback(result);
  });
}

module.exports = router;
