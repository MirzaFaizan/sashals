const config = {};

config.mongodbHost = 'mongodb://faizi:faizi@cluster0-shard-00-00-aquse.mongodb.net:27017,cluster0-shard-00-01-aquse.mongodb.net:27017,cluster0-shard-00-02-aquse.mongodb.net:27017/sashals?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
config.mongodbHostLocal = 'mongodb://localhost:27017/';
config.mongodbName = 'sashals';

module.exports = config;
