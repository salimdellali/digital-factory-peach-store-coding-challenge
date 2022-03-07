const mongoose = require('mongoose');

const SongSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		artist: {
			type: String,
			required: true,
		},
		album: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{ collection: 'songs' }
);

module.exports = mongoose.model('Song', SongSchema);
