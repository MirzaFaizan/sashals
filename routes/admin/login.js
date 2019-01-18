var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const MongoClient = mongodb.MongoClient;

const config = require('../../config');

router.get('/', function(req, res, next) {
  let action = req.query.action;
  if(action == 'logout') {
    req.session.adminId = undefined;
  }
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    db.collection("sites").find({}).toArray((err, site) => {
      try {
        res.render('admin/login', {
          title: site[0].title+' - Admin Login',
          logo: site[0].image,
          footer: site[0].title
        });
      }catch(err) {
        res.render('admin/login', {
          title: 'Blog - Admin Login',
          logo: 'vFR1Q.png',
          footer: 'Blog'
        });
      }

    });
  });
});

router.post('/', function(req, res, next) {
  let data = {};
  let response = {};
  data.password = req.body.password;
  data.email = req.body.email;

  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const saltRounds = 10;
    const collection = db.collection('admins');
    collection.find({}).toArray((err, result) => {
      if(result[0]) {
        findAdmin(db, data, (user) => {
          if(!user[0]) {
            response.success = false;
            response.message = 'Email doesn\'t exists';
            return res.send(response);
          }
          bcrypt.compare(data.password, user[0].password, function(err, result) {
            if(!result) {
              response.success = false;
              response.message = 'Incorrect Password';
              return res.send(response);
            }
            req.session.adminId = user[0]._id;
            response.success = true;
            response.message = 'Successfully Login';
            res.send(response);
          });
        })
      }else {
        bcrypt.hash(data.password, saltRounds, function(err, hash) {
          collection.insertOne({
            username: '',
            email: data.email,
            password: hash,
            question: '',
            answer: '',
            image: '',
            role: 0,
            created_date: new Date()
          }, (err, result) => {
            req.session.adminId = result.insertedId;
            response.success = true;
            response.message = 'Successfully Login';
            return res.send(response);
          })
        });
      }
    });
  });
});

router.get('/verify-admin', function(req, res, next) {
  res.render('admin/verify_admin', {
    title: 'Blog - Verify Admin'
  });
});

router.post('/verify-admin', function(req, res, next) {
  let data = {};
  let response = {};
  data.email = req.body.email;
  data.question = req.body.question;
  data.answer = req.body.answer;
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('admins');
    collection.find({email: data.email, question: data.question, answer: data.answer}).toArray((err, result) => {
      if(!result[0]) {
        response.success = false;
        response.message = 'Invalid Information';
        return res.send(response);
      }
      response.success = true;
      response.message = 'User Verified';
      return res.send(response);
    });
  });
});

router.post('/change-password', function(req, res, next) {
  let data = {};
  let response = {};
  data.email = req.body.email;
  data.newpassword = req.body.newpassword;
  const saltRounds = 10;
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    findAdmin(db, data, (user) => {
      if(!user[0]) {
        response.success = false;
        response.message = 'Unable to change password';
        return res.send(response);
      }
      bcrypt.hash(data.newpassword, saltRounds, function(err, hash) {
        if(err) {
          response.success = false;
          response.message = 'Something wents wrong';
          res.send(response);
          return;
        }
        const collection = db.collection('admins');

        collection.updateOne({email: data.email},
          { $set:
            {
              password: hash
          }
        }, (err, result) => {
          response.success = true;
          response.message = 'Successfully Changed Password';
          return res.send(response);
        })
      });
    })
  });
});

const findAdmin = (db, data, callback) => {
  const collection = db.collection('admins');
  collection.find({email: data.email}).toArray((err, result) => {
    callback(result);
  });
}

module.exports = router;
