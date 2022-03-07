const mongoose = require('mongoose');

const PurchasedSongsSchema = mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		idSong: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Song',
			required: true,
		},
		purchaseDate: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: 'purchasedSongs' }
);

module.exports = mongoose.model('PurchasedSongs', PurchasedSongsSchema);
