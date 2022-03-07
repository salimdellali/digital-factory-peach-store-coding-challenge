const express = require('express');
const cors = require('cors');
require('dotenv/config');
require('./database');

const auth = require('./middlewares/auth');

// Init app
const app = express();

// to allow the API to be fetched from anywhere
app.use(cors());

// to be able to parse json data and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes and use routes as middlewares
app.use('/api/songs', require('./routes/api/songs'));
app.use('/api/signup', require('./routes/api/signup'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/purchase-song', require('./routes/api/purchase-song'));
app.use('/api/my-purchased-songs', require('./routes/api/my-purchased-songs'));

// test if / route works
app.get('/', auth, (req, res) => {
	res.send('we are on root');
});

// set PORT to listen to
const PORT = process.env.PORT || 1234;
app.listen(PORT, (err) => {
	if (err) console.error(err);
	console.log(`Server started on port ${PORT} ...`);
});
