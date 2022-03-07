const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const PurchasedSong = require('../../models/PurchasedSong');

/**
 * @route	GET api/my-songs
 * @desc	get all purchased songs for the current logged user
 * @access	Private
 */
router.get('/', auth, (req, res) => {
	const idUser = req.user.id;

	PurchasedSong.find({ idUser })
		.populate('idSong')
		.then((purchasedSongs) => {
			let totalPrice = 0;
			let purchases = [];

			purchasedSongs.forEach((purchasedSong) => {
				const { id, purchaseDate, idSong } = purchasedSong;
				const purchasedSongDetails = idSong;
				const { price } = purchasedSongDetails;
				totalPrice += price;
				const purchase = {
					idPurchase: id,
					purchaseDate,
					purchasedSongDetails,
				};
				purchases.push(purchase);
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
