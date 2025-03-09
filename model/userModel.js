const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
     type: String,
     required: true 
    },
  email: {
     type: String, 
     required: true, 
     unique:true 
    },
  password: { 
    type: String,
    required: true 
    },
  profileImage: { 
    type: String,
     required : false
     },
  catalogs:[{ 
    type: String,
    required : false
   }]
});


const userModel=mongoose.model('users', userSchema);

module.exports = userModel

