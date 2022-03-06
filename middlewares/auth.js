const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
	const token = req.header('Authorization');

	// Check for token
	if (!token) {
		return res.status(401).json({ error: 'No token, authorization denied' });
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.jwtSecret);

		// Add user from payload
		req.user = decoded;

		next();
	} catch (e) {
		res.status(400).json({ error: 'Token not valid' });
	}
};

module.exports = auth;
