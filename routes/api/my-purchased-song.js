const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const PurchasedSong = require('../../models/PurchasedSong');

/**
 * @route	GET api/my-purchased-song
 * @desc	get my purchased song order details for the current logged user
 * @access	Private
 */
router.get('/', auth, (req, res) => {
	const idUser = req.user.id;
	const { idPurchase } = req.body;

	PurchasedSong.findOne({ id: idPurchase, idUser })
		.populate('idSong')
		.then((purchasedSong) => {
			// NOTE : here it's a single purchased song
			// check if the user did this purchase
			if (!purchasedSong) {
				res.status(400).json({ error: "Cette achat n'a pas été fait" });
				return;
			}

			// purchase found, return purchase details and priceTotal
			PurchasedSong.find({ idUser })
				.populate('idSong')
				.then((purchasedSongs) => {
					// NOTE : here it's all purchased songs (see the 's' at the end of the variable name)
					const totalPrice = purchasedSongs.reduce(
						(acc, curr) => curr.idSong.price,
						0
					);

					res.json({
						totalPrice,
						purchasedSong: {
							idPurchase: purchasedSong.id,
							purchaseDate: purchasedSong.purchaseDate,
							songDetails: purchasedSong.idSong,
						},
					});
				});
		})
		.catch((err) => {
			res.status(500).json({ error: 'Something went wrong! ' + err });
		});
});

module.exports = router;
