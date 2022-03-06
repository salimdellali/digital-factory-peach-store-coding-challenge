// Database Setup
// require('dotenv/config');
const mongoose = require('mongoose');

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DB_CONNECTION, (err) => {
	if (err) throw err;
	console.log('Connected to DB successfully');
});
