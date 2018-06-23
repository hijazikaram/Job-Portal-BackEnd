const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
	name: {type: String, required: true},
    email: { type: String, required: true }, 
    phoneNumber: { type: String, required: true }, 
    resumePath: { type: String, required: true },
    jobId: { type: String, required: true }
});

module.exports = mongoose.model('Application', ApplicationSchema);