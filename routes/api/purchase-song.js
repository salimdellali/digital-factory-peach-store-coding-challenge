// import npm packages
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { isValidObjectId } = require('../../helpers/utilities');

// Song Model
const PurchasedSong = require('../../models/PurchasedSong');
const Song = require('../../models/Song');

// /**
//  * @route	GET api/songs
//  * @desc	Get all the available songs to purchase
//  * @access	Public
//  */
// router.get('/', (req, res) => {
// 	Song.find()
// 		.exec()
// 		.then((songs) => {
// 			res.json(songs);
// 		})
// 		.catch((err) => {
// 			res.json({ error: 'Something went wrong! ' + err });
// 		});
// });

/**
 * @route	POST api/purchase/song
 * @desc	Add a new Song Product
 * @access	Private
 */
router.post('/', auth, (req, res) => {
	const { idSong } = req.body;
	const idUser = req.user.id;
	// const idUser =

	// check if the song id is a valid Object Id
	if (!isValidObjectId(idSong)) {
		res.status(400).json({
			error:
				"Identifiant de la chanson érroné, l'identifiant doit être de type ObjectID valide",
		});
		return;
	}

	// check if the requested song exist in the songs library
	Song.findById(idSong)
		.then((song) => {
			if (!song) {
				res
					.status(404)
					.json({ error: "La chanson n'existe pas dans la librairie" });
				return;
			}

			// check if the song hasn't been purchased
			PurchasedSong.findOne({ idSong, idUser }).then((purchasedSong) => {
				if (purchasedSong) {
					res.status(400).json({ error: 'La chanson a été déjà acheté' });
					return;
				}

				// eveyring's ok, let the user purchase the song
				const newPurchasedSong = new PurchasedSong(
					JSON.parse(JSON.stringify({ idSong, idUser }))
				);
				newPurchasedSong.save().then((purchase) => {
					res.json({
						idPurchase: purchase.id,
						msg: 'Chanson achetée avec succès',
					});
				});
			});
		})
		.catch((err) => {
			res.json({ error: 'Something went wrong! ' + err });
		});
});

module.exports = router;
