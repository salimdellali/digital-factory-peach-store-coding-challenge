const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const PurchasedSong = require('../../models/PurchasedSong');

/**
 * @route	GET api/my-purchased-songs
 * @desc	get all purchased songs orders details for the current logged user
 * @access	Private
 */
router.get('/', auth, (req, res) => {
	const idUser = req.user.id;

	PurchasedSong.find({ idUser })
		.populate('idSong')
		.then((purchasedSongs) => {
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
		})
		.catch((err) => {
			res.json({ error: 'Something went wrong! ' + err });
		});
});

module.exports = router;
