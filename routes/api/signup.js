const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');

/**
 * @route GET api/signup
 * @desc signup and receive a JWT Token Authorization
 * @access Public
 */
router.post('/', (req, res) => {
	const { firstName, lastName, phoneNumber, username, email, password } =
		req.body;

	// Simple validation
	if (
		!firstName ||
		!lastName ||
		!phoneNumber ||
		!username ||
		!email ||
		!password
	) {
		return res
			.status(400)
			.json({ error: 'Veillez remplire tout les champs SVP' });
	}

	// TODO verify input email syntax
	// TODO verify input phone number syntax

	// Check for existing user
	User.findOne({ $or: [{ phoneNumber: phoneNumber }, { email: email }] }).then(
		(user) => {
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

			// Creater salt & hash
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser.save().then((user) => {
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
										lastAccess: user.lastAccess,
									},
								});
							}
						);
					});
				});
			});
		}
	);
});

module.exports = router;
