const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
	isAtLeastOneValueEmpty,
	isEmailValid,
} = require('../../helpers/utilities');

const User = require('../../models/User');

/**
 * @route GET api/signup
 * @desc signup and receive a JWT Token Authorization
 * @access Public
 */
router.post('/', async (req, res) => {
	const { firstName, lastName, phoneNumber, username, email, password } =
		req.body;

	// Simple validation
	if (
		isAtLeastOneValueEmpty([
			firstName,
			lastName,
			phoneNumber,
			username,
			email,
			password,
		])
	) {
		return res
			.status(400)
			.json({ error: 'Veillez remplire tout les champs SVP' });
	}

	if (!isEmailValid(email)) {
		return res
			.status(400)
			.json({ error: "L'adresse email fournie est invalide" });
	}

	// Check for existing user
	try {
		const user = await User.findOne({
			$or: [{ phoneNumber: phoneNumber }, { email: email }],
		});

		if (user)
			return res.status(301).json({
				msg: 'Utilisateur déjà existant avec un tel numéro de téléphone ou adresse email',
				redirect: req.protocol + '://' + req.get('host') + '/api/login',
			});

		// user does not exist, create new
		const newUser = new User({
			firstName,
			lastName,
			phoneNumber,
			username,
			email,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newUser.password, salt);
		newUser.password = hash;
		const newSavedUser = await newUser.save();

		const token = await jwt.sign(
			{ id: newSavedUser.id }, // the payload, first parameter of sign() method, can be anything
			process.env.jwtSecret, // the secret, second parameter
			{ expiresIn: 3600 } // Optional, expires ( here 3600 = 1 hours), 3rd argument
		);

		res.json({
			token,
			user: {
				id: newSavedUser.id,
				lastAccess: newSavedUser.lastAccess,
			},
		});
	} catch (e) {
		res.status(500).json({ error: 'Something went wrong! ' + e });
	}
});

module.exports = router;
