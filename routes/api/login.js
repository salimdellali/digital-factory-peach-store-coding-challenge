const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

/**
 * @route	POST api/login
 * @desc	Authenticate user
 * @access	Public
 */
router.post('/', async (req, res) => {
	const { userNameOrEmail, password } = req.body;

	// Simple validation
	if (!userNameOrEmail || !password) {
		return res
			.status(400)
			.json({ error: 'Veillez remplir tout les champs SVP' });
	}

	try {
		// Check for existing user
		const user = await User.findOne({
			$or: [{ username: userNameOrEmail }, { email: userNameOrEmail }],
		});
		if (!user)
			return res.status(400).json({
				error: "Utilisateur avec un tel username ou adresse email n'existe pas",
			});

		// Validate password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ error: 'Identifiants incorrectes' });

		// credentials are valid, update lastAccess and return the JWT Token with needed info
		const newAccessDate = Date.now();
		const lastAccesDate = user.lastAccess;

		await User.findOneAndUpdate(
			{ _id: user._id },
			{ lastAccess: newAccessDate }
		).exec();

		const token = await jwt.sign(
			{ id: user.id }, // the payload, first parameter of sign() method, can be anything
			process.env.jwtSecret, // the secret, second parameter
			{ expiresIn: 3600 } // Optional, expires ( here 3600 = 1 hours), 3rd argument
		);

		res.json({
			token,
			user: {
				id: user.id,
				lastAccess: lastAccesDate,
			},
		});
	} catch (e) {
		res.status(500).json({ error: 'Something went wrong! ' + e });
	}
});

module.exports = router;
