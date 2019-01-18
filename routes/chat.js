var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');

router.use(function(req, res, next) {
  if(req.session.userId == undefined) {
    res.redirect("/login")
  }else {
    next();
  }
})

router.get('/', function(req, res, next) {

  if(req.query.clientId) {
    mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      var db = dbConnect.db(config.mongodbName);
      db.collection('categories').find({}).toArray((err, categories) => {
        db.collection("sites").find({}).toArray((err, site) => {
            findChatUserRoom(db, req.session.userId, req.query.clientId, (data) => {

              if(data[0]) {
                findChatUser(db, req.session.userId, (chatUser) => {
                  db.collection(data[0].room).find({}).toArray((err, messages) => {
                    return res.render('index', {
                      title: site[0].title+' - Message',
                      show: 'chat',
                      categories: categories,
                      sites: site,
                      chatUser: chatUser,
                      receiverId: req.query.clientId,
                      messages: messages
                    });
                  });
                });
              }else {
                let userId = {
                  _id: new mongodb.ObjectID(req.session.userId)
                }
                let agentId = {
                  _id: new mongodb.ObjectID(req.query.clientId)
                }
                db.collection('users').aggregate(
                   [
                     { $match: { $or: [
                       userId, agentId
                     ] } }
                   ]
                ).toArray((err, users) => {
                  let senderId = "",senderName="",senderImage="",receiverId="",receiverName="",receiverImage="";
                  if(req.session.userId == users[0]._id+"") {
                    senderId = users[0]._id+"";
                    senderName = users[0].fname+' '+users[0].lname;
                    senderImage = users[0].image;
                    receiverId = users[1]._id+"";
                    receiverName = users[1].fname+' '+users[1].lname;
                    receiverImage = users[1].image;
                    room = "Room"+users[0]._id+"";
                  }
                  if(req.session.userId == users[1]._id+"") {
                    senderId = users[1]._id+"";
                    senderName = users[1].fname+' '+users[1].lname;
                    senderImage = users[1].image;
                    receiverId = users[0]._id+"";
                    receiverName = users[0].fname+' '+users[0].lname;
                    receiverImage = users[0].image;
                    room = "Room"+users[1]._id+"";
                  }
                  db.collection("chatrooms").insertOne({
                    senderId,
                    senderName,
                    senderImage,
                    receiverId,
                    receiverName,
                    receiverImage,
                    room
                  }, (err, result) => {
                    res.redirect('/messages?clientId='+req.query.clientId);
                  });
                });
              }
            })
        });
      })
    });
  }else {
    mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
      var db = dbConnect.db(config.mongodbName);
      db.collection('categories').find({}).toArray((err, categories) => {
        db.collection("sites").find({}).toArray((err, site) => {
          findChatUser(db, req.session.userId, (chatUser) => {
            res.render('index', {
              title: site[0].title+' - Message',
              show: 'chat',
              categories: categories,
              sites: site,
              chatUser: chatUser,
              receiverId: undefined
            });
          });
        });
      })
    });
  }
});

router.post('/send', (req, res) => {
  let receiverId = req.body.receiverId;
  let message = req.body.message;
  mongoClient.connect(config.mongodbHost, (err, dbConnect) => {
    var db = dbConnect.db(config.mongodbName);
    findChatUserRoom(db, req.session.userId, receiverId, (data) => {
      db.collection(data[0].room).insertOne({
        senderId: req.session.userId,
        receiverId: receiverId,
        room: data[0].room,
        message: message
      }, (err, result) => {
        db.collection('categories').find({}).toArray((err, categories) => {
          db.collection("sites").find({}).toArray((err, site) => {
            findChatUser(db, req.session.userId, (chatUser) => {
              return res.render('index', {
                title: site[0].title+' - Message',
                show: 'chat',
                categories: categories,
                sites: site,
                chatUser: chatUser,
                receiverId: receiverId
              });
            });
          });
        });
      });
    });
  });
})

const findChatUser = (db, userId, callback) => {
  db.collection('chatrooms').aggregate(
     [
       { $match: { $or: [
         {
           senderId:userId
         },
         {
           receiverId:userId
         }
       ] } }
     ]
  ).sort({_id:-1}).toArray((err, result) => {
    callback(result);
  });
}

const findChatUserRoom = (db, userId, clientId, callback) => {
  db.collection('chatrooms').aggregate(
    [
      { $match: { $or: [
        {
          senderId: userId,
          receiverId: clientId
        },
        {
          senderId: clientId,
          receiverId: userId
        }
      ] } }
    ]
  ).toArray((err, result) => {
    callback(result);
  });
}

module.exports = router;
