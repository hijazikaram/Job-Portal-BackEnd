var mongoose = require('mongoose');

const InstitutionSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  logo : String,
  phoneNumber: String,
  address: String,
  facebook: String,
  twitter: String,
  google: String,
  linkedin: String, 
  availableJobs: { type: Number, default: 0 }
});

module.exports = mongoose.model('Institution', InstitutionSchema);