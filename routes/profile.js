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
    cb(null, './public/uploads/users');
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

router.use(function(req, res, next) {
  if(req.session.userId == undefined) {
    res.redirect("/login")
  }else {
    next();
  }
})

router.get('/', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    findUser(db, req.session.userId, (user) => {
      db.collection('offers').find({userId: req.session.userId}).toArray((err, offer) => {
        db.collection('requests').find({userId: req.session.userId}).toArray((err, request) => {
          db.collection('categories').find({}).toArray((err, categories) => {
            db.collection("sites").find({}).toArray((err, site) => {
              res.render('index', {
                title: site[0].title+' - Profile',
                show: 'profile',
                userData: user[0],
                offers: offer,
                requests: request,
                categories: categories,
                sites: site
              });
            });
          });
        });
      })
    })
  })
});

router.get('/edit-profile', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    findUser(db, req.session.userId, (user) => {
      if(req.query.action == 'change-password') {
        db.collection('categories').find({}).toArray((err, categories) => {
          db.collection("sites").find({}).toArray((err, site) => {
            return res.render('index', {
              title: site[0].title+' - Edit Profile',
              show: 'editProfile',
              showPassword: true,
              userData: user[0],
              categories: categories,
              sites: site
            });
          });
        });
      }
      db.collection('categories').find({}).toArray((err, categories) => {
        db.collection("sites").find({}).toArray((err, site) => {
          res.render('index', {
            title: site[0].title+' - Edit Profile',
            show: 'editProfile',
            userData: user[0],
            showPassword: false,
            categories: categories,
            sites: site
          });
        });
      });
    })
  })
});

router.post('/edit-profile', function(req, res, next) {

  var email = req.body.updateEmail;
  var fname = req.body.updateFirst;
  var lname = req.body.updateLast;
  var country = req.body.updateCountry;
  var city = req.body.updateCity;
  var phone = req.body.updatePhone;
  var skype = req.body.updateSkype;
  var wechat = req.body.updateWechat;
  var vkontakte = req.body.updateVkontakte;
  var facebook = req.body.updateFacebook;
  var google = req.body.updateGoogle;
  var orgCountry = req.body.updateOrgCountry
  var orgId = req.body.updateOrgId;
  var orgName = req.body.updateOrgName;
  var orgPhone = req.body.updatePhone;
  var orgAddress = req.body.updateOrgAddress;
  var description = req.body.updateDescription;
  var language = req.body.updateLanguage;
  var skill = req.body.updateSkill;

  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    var collection = db.collection("users");
    var updateObject = {
      _id : new mongodb.ObjectID(req.session.userId)
    }
      collection.updateOne(updateObject,
          {
            $set: {
              fname,
              lname,
              email,
              country,
              city,
              phone,
              skype,
              wechat,
              vkontakte,
              facebook,
              google,
              companyCountry:orgCountry,
              companyId:orgId,
              companyName:orgName,
              companyPhone:orgPhone,
              companyAddress:orgAddress,
              skills:skill,
              language,
              description,
              updated_date: new Date()
            }
          }, (err, result) => {
          res.redirect('/profile/edit-profile')
        });
  })
});

router.post('/edit-password', function(req, res, next) {
  var newpassword = req.body.newpassword;
  var currentPassword = req.body.currentPassword;
  var response = {};
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    var collection = db.collection("users");
    var updateObject = {
      _id: new mongodb.ObjectID(req.session.userId)
    }
    var saltRounds = 10;
    findUser(db, req.session.userId, (user) => {
      bcrypt.compare(currentPassword, user[0].password, function(err, data) {
        if(!data) {
          response.success = false;
          response.message = 'Incorrect current password';
          res.send(response);
          return;
        }
        bcrypt.hash(newpassword, saltRounds, function(err, hash) {
          collection.updateOne(updateObject,
              {
                $set: {
                  password: hash
                }
              }, (err, result) => {
                response.success = true;
                response.message = 'Successfully Changed Password';
                res.send(response);
                return;
            });
        });
      });
    })
  })
});

router.post('/edit-photo', upload.single('myPic'), function(req, res, next) {
  try {
    let image = req.file.originalname;
    let updateObject = {
      _id: new mongodb.ObjectID(req.session.userId)
    }
    mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
      const collection = db.collection('users');
      collection.updateOne(updateObject, {
        $set: {
          image
        }
      }, (err, result) => {
        req.session.userImage = image;
        db.collection('chatrooms').updateOne({receiverId: req.session.userId}, {
          $set: {
            receiverImage: image
          }
        }, (error, data) => {
          db.collection('chatrooms').updateOne({senderId: req.session.userId}, {
            $set: {
              senderImage: image
            }
          }, (error, data) => {
             res.redirect('/profile');
          });
        })
      })
    });
  }catch(err) {
    res.redirect('/profile');
  }
});

router.get('/offer', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    db.collection('categories').find({}).toArray((err, categories) => {
      db.collection("sites").find({}).toArray((err, site) => {
        res.render('index', {
          title: site[0].title+' - Offer',
          show: 'offer',
          categories: categories,
          sites: site
        });
      });
    })
  });
});

router.get('/offer/edit', function(req, res, next) {
  var getObject = {
    _id: new mongodb.ObjectID(req.query.id)
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    const collection = db.collection('offers');
    collection.findOne(getObject, (err, offer) => {
      db.collection('categories').find({}).toArray((err, categories) => {
        db.collection("sites").find({}).toArray((err, site) => {
          res.render('index', {
            title: site[0].title+' - Offer Edit',
            show: 'editOffer',
            offer: offer,
            categories: categories,
            sites: site
          });
        });
      });
    })
  })
});

router.get('/request', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
      db.collection('categories').find({}).toArray((err, categories) => {
        db.collection("sites").find({}).toArray((err, site) => {
          res.render('index', {
            title: site[0].title+' - Request',
            show: 'request',
            categories: categories,
            sites: site
          });
        });
      });
  })
});

const findUser = (db, userId, callback) => {
  const collection = db.collection('users');
  const findObject = {
    _id: new mongodb.ObjectID(userId)
  }
  collection.find(findObject).toArray((err, result) => {
    callback(result);
  });
}

module.exports = router;
