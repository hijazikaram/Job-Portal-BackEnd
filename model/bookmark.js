const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
	userId: {type: String, required: true},
  jobId: { type: String, required: true },
  created_at: { type: Date }
});

BookmarkSchema.pre('save', function(next) {
    const currentDate = new Date();
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
