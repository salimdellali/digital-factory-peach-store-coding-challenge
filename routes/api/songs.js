const express = require('express');
const router = express.Router();

const Song = require('../../models/Song');

/**
 * @route	GET api/songs
 * @desc	Get all the available songs to purchase
 * @access	Public
 */
router.get('/', (req, res) => {
	Song.find()
		.exec()
		.then((songs) => {
			res.json(songs);
		})
		.catch((err) => {
			res.status(500).json({ error: 'Something went wrong! ' + err });
		});
});

/**
 * @route	POST api/songs
 * @desc	Add a new Song Product
 * @access	Public
 */
router.post('/', (req, res) => {
	const newSong = new Song(JSON.parse(JSON.stringify(req.body)));
	newSong
		.save()
		.then((song) => res.json(song))
		.catch((err) => {
			// Server Error
			res.status(500).json({ error: 'Something went wrong! ' + err });
		});
});

module.exports = router;
