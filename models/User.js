const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		registerDate: {
			type: Date,
			default: Date.now,
		},
		lastAccess: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: 'users' }
);

module.exports = mongoose.model('User', UserSchema);
