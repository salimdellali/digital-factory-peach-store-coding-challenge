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
router.post('/', (req, res) => {
	const { userNameOrEmail, password } = req.body;

	// Simple validation
	if (!userNameOrEmail || !password) {
		return res
			.status(400)
			.json({ error: 'Veillez remplire tout les champs SVP' });
	}

	// Check for existing user
	User.findOne({
		$or: [{ username: userNameOrEmail }, { email: userNameOrEmail }],
	}).then((user) => {
		if (!user)
			return res.status(400).json({
				error: "Utilisateur avec un tel username ou adresse email n'existe pas",
			});

		// Validate password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch)
				return res.status(400).json({ error: 'Identifiants incorrectes' });

			// credentials are valid, update lastAccess and return the JWT Token with needed info
			const newAccessDate = Date.now();
			const lastAccesDate = user.lastAccess;
			User.findOneAndUpdate(
				{ _id: user._id },
				{ lastAccess: newAccessDate }
			).exec();

			jwt.sign(
				{ id: user.id }, // the payload, first parameter of sign() method, can be anything
				process.env.jwtSecret, // the secret, second parameter
				{ expiresIn: 3600 }, // Optional, expires ( here 3600 = 1 hours), 3rd argument
				(err, token) => {
					// because it's asynchronous, callback function
					if (err) throw err;
					res.json({
						token,
						user: {
							id: user.id,
							lastAccess: lastAccesDate,
						},
					});
				}
			);
		});
	});
});

module.exports = router;
