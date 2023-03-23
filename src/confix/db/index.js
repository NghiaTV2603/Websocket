const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/test_mongo_dev');
    console.log('connect DB Successfully');
  } catch (e) {
    console.log('Error connect DB');
  }
}

module.exports = { connect };
