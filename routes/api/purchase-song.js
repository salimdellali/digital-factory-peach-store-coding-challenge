const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { isValidObjectId } = require('../../helpers/utilities');

const PurchasedSong = require('../../models/PurchasedSong');
const Song = require('../../models/Song');

/**
 * @route	POST api/purchase-song
 * @desc	Add a new Song Product
 * @access	Private
 */
router.post('/', auth, async (req, res) => {
	const { idSong } = req.body;
	const idUser = req.user.id;

	// check if the song id is a valid Object Id
	if (!isValidObjectId(idSong))
		return res.status(400).json({
			error:
				"Identifiant de la chanson érroné, l'identifiant doit être de type ObjectID valide",
		});

	try {
		// check if the requested song exist in the songs library
		const song = await Song.findById(idSong);
		if (!song)
			return res
				.status(404)
				.json({ error: "La chanson n'existe pas dans la librairie" });

		// check if the song hasn't been purchased
		const purchasedSong = await PurchasedSong.findOne({ idSong, idUser });
		if (purchasedSong)
			return res.status(400).json({ error: 'La chanson a été déjà achetée' });

		// eveyring's ok, let the user purchase the song
		const newPurchasedSong = new PurchasedSong(
			JSON.parse(JSON.stringify({ idSong, idUser }))
		);
		const purchase = await newPurchasedSong.save();

		res.json({
			idPurchase: purchase.id,
			msg: 'Chanson achetée avec succès',
		});
	} catch (e) {
		res.status(500).json({ error: 'Something went wrong! ' + e });
	}
});

module.exports = router;
