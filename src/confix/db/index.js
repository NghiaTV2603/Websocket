const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect("mongodb+srv://nghiatran3726:Nghiatv26200103@cluster0.wxwu0ip.mongodb.net/?retryWrites=true&w=majority");
    console.log('connect DB Successfully');
  } catch (e) {
    console.log('Error connect DB');
  }
}

module.exports = { connect };
