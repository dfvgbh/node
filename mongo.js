const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://localhost:27017';

module.exports = (app) => {
  MongoClient.connect(MONGO_URL, { useNewUrlParser: true })
    .then((connection) => {
      app.products = connection.db('shop').collection('products');
      console.info('Database connection established');
    })
    .catch((err) => console.error(err))
};