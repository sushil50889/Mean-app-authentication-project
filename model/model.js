var mongoose = require('mongoose');

//defining Schema of users
var userSchema = new mongoose.Schema({
name: {
        type: String
},            
email: {
        type: String,
        unique: true
},
phone: {
        type: String,
        unique: true
},     
city: {
        type: String
},
password: {
        type: String
},
avatar: {
        type: String,
        default: ''
},
phoneOtp: {
        type: Number,
        default: 0
},
emailOtp: {
        type: Number,
        default: 0
},
active: {
          type: Boolean,
          default: false
},
date: {
        type: Date,
        default: new Date()
}       
});

//exporting user model
module.exports = mongoose.model('user', userSchema);