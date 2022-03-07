const express = require('express');
const router = express.Router();

const Song = require('../../models/Song');

/**
 * @route	GET api/songs
 * @desc	Get all the available songs to purchase
 * @access	Public
 */
router.get('/', async (req, res) => {
	try {
		const songs = await Song.find();
		res.json(songs);
	} catch (e) {
		res.status(500).json({ error: 'Something went wrong! ' + e });
	}
});

/**
 * @route	POST api/songs
 * @desc	Add a new Song Product
 * @access	Public
 */
router.post('/', async (req, res) => {
	try {
		const newSong = new Song(JSON.parse(JSON.stringify(req.body)));
		const song = await newSong.save();
		res.json(song);
	} catch (e) {
		res.status(500).json({ error: 'Something went wrong! ' + e });
	}
});

module.exports = router;
