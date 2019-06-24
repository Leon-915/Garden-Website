//Users Schema

var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
autoIncrement.initialize(mongoose.connection);
var jobsSchema = new mongoose.Schema({
  __createdAt: Date,
  __updatedAt: Date,
  __deleted: {type:Boolean,default:false},
  __active: {type:Boolean,default:true},
  location: String,
  services:[Number],
  gatewidth:String,
  grassheight:String,
  servicerequied:Number,
  latitude:{type:Number,default:0},
  longitude:{type:Number,default:0},
  propertydetails: String,
  extradetails: String,
  lastmaintained: String,
  propertysize: String,
  workhours:Number,
  cost:Number,
  greenwasteremoval:{type:Boolean,default:false},
  accesstoproperty:{type:Boolean,default:false},
  subscription:{type:Boolean,default:false},
  subscriptionID:{type:String,default:""},
  pets:{type:Boolean,default:false},
  jobdate:Date,  
  userid:Number,
  status:Number,
  contactnumber: String,
  postcode: String,
  jobaddress: {type:String,default:""},
  images:[String]
  
  
});


jobsSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.__updatedAt = currentDate;
  
  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.__createdAt = currentDate;

  

  next();
});

jobsSchema.plugin(autoIncrement.plugin, 'Jobs');
module.exports = mongoose.model('Jobs', jobsSchema);