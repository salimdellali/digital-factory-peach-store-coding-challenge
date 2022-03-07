const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const PurchasedSong = require('../../models/PurchasedSong');

/**
 * @route	GET api/my-purchased-song
 * @desc	get my purchased song order details for the current logged user
 * @access	Private
 */
router.get('/', auth, async (req, res) => {
	const idUser = req.user.id;
	const { idPurchase } = req.body;

	try {
		const purchasedSong = await PurchasedSong.findOne({
			id: idPurchase,
			idUser,
		}).populate('idSong'); // NOTE : here it's a single purchased song

		// check if the user did this purchase
		if (!purchasedSong)
			return res.status(400).json({ error: "Cette achat n'a pas été fait" });

		// purchase found, return purchase details and priceTotal
		const purchasedSongs = await PurchasedSong.find({ idUser }).populate(
			'idSong'
		); // NOTE : here it's all purchased songs (see the 's' at the end of the variable name)

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
	} catch (e) {
		res.status(500).json({ error: 'Something went wrong! ' + e });
	}
});

module.exports = router;
