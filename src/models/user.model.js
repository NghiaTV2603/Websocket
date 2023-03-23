const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar : {
        type : String ,
        default : 'https://www.advancy.com/wp-content/uploads/2017/11/avatar.jpg'
    }
},{
    timestamps : true
});

module.exports = mongoose.model('User', User);