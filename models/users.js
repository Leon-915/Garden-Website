//Users Schema
var passwordHash = require('password-hash');
var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
autoIncrement.initialize(mongoose.connection);
var userSchema = new mongoose.Schema({
  __createdAt: Date,
  __updatedAt: Date,
  __deleted: {type:Boolean,default:false},
  __active: {type:Boolean,default:true},
  firstname: String,
  lastname: String,
  role: {type:String,default:"customer"},
  email: String,
  profileimage:String,
  stripe_customerid:{type:String,default:""},
  password:String,
  googleId:{type:String,default:""},
  facebookId:{type:String,default:""},
  resetpasswordToken:String,
});


userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.__updatedAt = currentDate;
  if (this.hasOwnProperty('password')) {
    this.password =  passwordHash.generate(this.password);  
  }
  
  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.__createdAt = currentDate;

  next();
});

userSchema.plugin(autoIncrement.plugin, 'Users');
module.exports = mongoose.model('Users', userSchema);



