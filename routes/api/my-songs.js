const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const PurchasedSong = require('../../models/PurchasedSong');

/**
 * @route	GET api/purchase
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

		// // check if the requested song exist in the songs library
		// Song.findById(idSong)
		// 	.then((song) => {
		// 		if (!song) {
		// 			res
		// 				.status(404)
		// 				.json({ error: "La chanson n'existe pas dans la librairie" });
		// 			return;
		// 		}

		// 		// check if the song hasn't been purchased
		// 		PurchasedSong.findOne({ idSong, idUser }).then((purchasedSong) => {
		// 			if (purchasedSong) {
		// 				res.status(400).json({ error: 'La chanson a été déjà achetée' });
		// 				return;
		// 			}

		// 			// eveyring's ok, let the user purchase the song
		// 			const newPurchasedSong = new PurchasedSong(
		// 				JSON.parse(JSON.stringify({ idSong, idUser }))
		// 			);
		// 			newPurchasedSong.save().then((purchase) => {
		// 				res.json({
		// 					idPurchase: purchase.id,
		// 					msg: 'Chanson achetée avec succès',
		// 				});
		// 			});
		// 		});
		// 	})
		.catch((err) => {
			res.json({ error: 'Something went wrong! ' + err });
		});
});

module.exports = router;
