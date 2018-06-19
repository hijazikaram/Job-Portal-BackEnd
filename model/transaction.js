var mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
	id: {type: String, required: true},
	institution_id: {type: String, required: true},
	total: { type: Number, default: 0 }, 
	used: { type: Number, default: 0 }, 
	remaining: { type: Number, default: 0 }
});

module.exports = mongoose.model('Transaction', TransactionSchema);