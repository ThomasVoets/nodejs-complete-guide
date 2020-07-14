const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
  })
    .then(result => {
      console.log('Connected to MongoDB!');
      callback(result);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = mongoConnect;
