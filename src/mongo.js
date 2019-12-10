const { MongoClient } = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017';

let manager = {};

module.exports = {
  connect(app) {
    MongoClient.connect(MONGO_URL, { useNewUrlParser: true })
      .then((connection) => {
        manager.connection = connection.db('shop').collection('products');
        app.products = manager.connection;
        console.info('Database connection established');
      })
      .catch((err) => console.error(err));
  },
  manager,
};
