// Database Setup
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, (err) => {
	if (err) throw err;
	console.log('Connected to DB successfully');
});
