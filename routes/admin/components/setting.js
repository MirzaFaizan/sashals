var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
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
    cb(null, './public/uploads/admin');
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
    const collection = db.collection('admins');
    findAdmin(db, req.session.adminId, (admin) => {
      //console.log(admin);
      db.collection("sites").find({}).toArray((err, site) => {
      if(admin[0]) {
        try {
          res.render('admin/index', {
            title: site[0].title+' - Admin Setting',
            logo: site[0].image,
            show: 'setting',
            adminInfo: admin[0],
            footer: site[0].title,
          });
        }catch(err) {
          res.render('admin/index', {
            title: 'Blog - Admin Setting',
            logo: 'vFR1Q.png',
            show: 'setting',
            adminInfo: admin[0],
            footer: 'Blog'
          });
        }

      }
    });
    });
  });
});

router.post('/general', function(req, res, next) {
  let data = {};
  let response = {};
  data.username = req.body.username;
  data.email = req.body.email;
  data.question = req.body.question;
  data.answer = req.body.answer;

  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('admins');
    let updateObject = {
      _id: new mongodb.ObjectID(req.session.adminId)
    }
    collection.updateOne(updateObject, {
      $set: {
        username: data.username,
        email: data.email,
        question: data.question,
        answer: data.answer
      }
    }, (err, result) => {
      response.success = true;
      response.message = 'Successfully Updated...';
      return res.send(response);
    })
  });
});

router.post('/image', upload.single('changeImage'), function(req, res, next) {
  try {
    let image = req.file.originalname;
    let updateObject = {
      _id: new mongodb.ObjectID(req.session.adminId)
    }
    MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
      const collection = db.collection('admins');
      collection.updateOne(updateObject, {
        $set: {
          image
        }
      }, (err, result) => {
        res.redirect('/admin/setting');
      })
    });
  }catch(err) {
    res.redirect('/admin/setting');
  }
});

router.post('/change-password', function(req, res, next) {
  let data = {};
  let response = {};
  data.currentpassword = req.body.currentpassword;
  data.newpassword = req.body.newpassword;
  const saltRounds = 10;
  MongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    findAdmin(db, req.session.adminId, (user) => {
      if(!user[0]) {
        response.success = false;
        response.message = 'Unable to change password';
        return res.send(response);
      }
      bcrypt.compare(data.currentpassword, user[0].password, function(err, result) {
        if(!result) {
          response.success = false;
          response.message = 'Incorrect Current Password';
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
          const updateObject = {
            _id: new mongodb.ObjectID(req.session.adminId)
          }
          collection.updateOne(updateObject,
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
      });
    })
  });
});

const findAdmin = (db, id, callback) => {
  let adminObject = {
    _id : new mongodb.ObjectID(id)
  }
  const collection = db.collection('admins');
  collection.find(adminObject).toArray((err, result) => {
    callback(result);
  });
}

module.exports = router;
