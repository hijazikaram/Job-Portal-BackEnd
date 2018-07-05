const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
	userId: {type: String, required: true},
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    resumePath: { type: String, required: true },
		resumeName: { type: String, required: true },
		resumeId: { type: String, required: true },
    jobId: { type: String, required: true },
    created_at: { type: Date }
});

ApplicationSchema.pre('save', function(next) {
    const currentDate = new Date();
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

module.exports = mongoose.model('Application', ApplicationSchema);
