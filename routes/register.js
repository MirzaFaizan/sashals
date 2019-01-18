var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var config = require('../config');
var async = require('async');
var crypto = require('crypto');

router.get('/', function(req, res, next) {
  if(req.query.action == 'logout') {
    req.session.userId = undefined;
    req.session.userImage = undefined;
    return res.redirect('/login');
  }
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
      db.collection('categories').find({}).toArray((err, categories) => {
        db.collection("sites").find({}).toArray((err, site) => {
          res.render('index', {
            title: site[0].title+' - Home',
            show: 'login',
            categories: categories,
            sites: site
          });
        });
      });
  })
});

router.post('/', function(req, res, next) {
  let data = {};
  let response = {};
  data.password = req.body.password;
  data.email = req.body.email;

  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
    findUser(db, data.email, (user) => {
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
        req.session.userId = user[0]._id;
        req.session.userImage = user[0].image;
        response.success = true;
        response.message = 'Successfully Login';
        res.send(response);
      });
    })
  });
});

router.post('/signup', function(req, res, next) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var password = req.body.password;
  var country = req.body.country;
  var city = req.body.city;
  var phone = req.body.phone;
  var saltRounds = 10;
  var response = {};
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    var collection = db.collection("users");
    findUser(db, email, (user) => {
      if(user[0]) {
        response.success = false;
        response.message = 'Email already taken';
        return res.send(response);
      }
      bcrypt.hash(password, saltRounds, function(err, hash) {
        collection.insertOne({
          fname,
          lname,
          email,
          password:hash,
          country,
          city,
          phone,
          skype:"",
          wechat:"",
          vkontakte:"",
          facebook:"",
          google:"",
          companyCountry:"",
          companyId:"",
          companyName:"",
          companyPhone:"",
          companyAddress:"",
          skills:"",
          language:"",
          description:"",
          image:"",
          role:"2",
          updated_date: "",
          created_date: new Date()}, (err, result) => {
            //console.log(result);
          if(!result) {
            response.success = false;
            response.message = 'Something wents wrong in server';
            return res.send(response);
          }
          req.session.userId = result.insertedId;
          response.success = true;
          response.message = 'Successfully Created User';
          res.send(response);
        });
      });
    });
  })
});

router.post('/verify-user', function(req, res, next) {
  var response = {};
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        //console.log(token);
        done(err, token);
      });
    },
    function(token, done) {
      mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
        var db = dbConnect.db(config.mongodbName);
        findUser(db, req.body.email, (user) => {
          if (!user[0]) {
            response.success = false;
            response.message = 'No account with that email address exists.';
            return res.send(response);
          }
          req.session.userToken = token;
          req.session.email = req.body.email;
          var smtpTransport = nodemailer.createTransport('smtps://gmail-id:password@smtp.gmail.com');
          var mailOptions = {
            to: user[0].email,
            from: 'passwordreset@demo.com',
            subject: 'Blog Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/login/reset-password/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            if(err) {
              console.log(err);
            }
            response.success = true;
            response.message = 'An e-mail has been sent to <span style="color: #000; font-weight: bold">' + user[0].email + '</span> with further instructions.';
            return res.send(response);
          });
        });
      });
    }
  ], function(err) {
    if (err) return next(err);
      res.redirect('/login');
  });
})

router.get('/reset-password/:token', function(req, res, next) {
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    const db = dbConnect.db(config.mongodbName);
      db.collection('categories').find({}).toArray((err, categories) => {
        db.collection("sites").find({}).toArray((err, site) => {
          res.render('index', {
            title: site[0].title+' - Reset Password',
            show: 'resetPassword',
            categories: categories,
            token: req.params.token,
            sites: site
          });
        });
      });
  })
});

router.post('/reset-password/:token', function(req, res, next) {
  if(req.session.email != undefined && req.session.userToken != undefined && req.session.userToken == req.params.token) {
    let data = {};
    let response = {};
    data.email = req.session.email;
    data.password = req.body.newpassword;
    const saltRounds = 10;
    mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      const db = dbConnect.db(config.mongodbName);
        findUser(db, data.email, (user) => {
          if(!user[0]) {
            response.success = false;
            response.message = 'Email doesn\'t exists';
            return res.send(response);
          }
          bcrypt.hash(data.password, saltRounds, function(err, hash) {
            if(err) {
              response.success = false;
              response.message = 'Something wents wrong';
              res.send(response);
              return;
            }
            const collection = db.collection('users');
              collection.updateOne({
                email: data.email},
                { $set:
                  {
                    password: hash
                }
              }, (err, result) => {
                req.session.email = undefined;
                req.session.userToken = undefined;
                response.success = true;
                response.message = 'Successfully Changed Password';
                res.send(response);
                return;
            })
        });
      });
    })
  }else {
    response.success = false;
    response.message = 'Session has been experied';
    res.send(response);
    return;
  }
});

const findUser = (db, email, callback) => {
  const collection = db.collection('users');
  collection.find({email}).toArray((err, result) => {
    callback(result);
  });
}

module.exports = router;
