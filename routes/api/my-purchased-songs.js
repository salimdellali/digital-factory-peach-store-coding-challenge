const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const PurchasedSong = require('../../models/PurchasedSong');

/**
 * @route	GET api/my-purchased-songs
 * @desc	get all purchased songs orders details for the current logged user
 * @access	Private
 */
router.get('/', auth, async (req, res) => {
	const idUser = req.user.id;
	try {
		const purchasedSongs = await PurchasedSong.find({ idUser }).populate(
			'idSong'
		);

		let totalPrice = 0;
		const purchases = purchasedSongs.map((purchasedSong) => {
			totalPrice += purchasedSong.idSong.price;

			return {
				idPurchase: purchasedSong.id,
				purchaseDate: purchasedSong.purchaseDate,
				songDetails: purchasedSong.idSong,
			};
		});

		res.json({
			totalPrice,
			purchases,
		});
	} catch (e) {
		res.status(500).json({ error: 'Something went wrong! ' + e });
	}
});

module.exports = router;
