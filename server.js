const express = require('express');
const cors = require('cors');
require('dotenv/config');
require('./database');

// Init app
const app = express();

// to allow the API to be fetched from anywhere
app.use(cors());

// to be able to parse json data and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes and use routes as middlewares
app.use('/api/signup', require('./routes/api/signup'));
app.use('/api/login', require('./routes/api/login'));

// test if / route works
app.get('/', (req, res) => {
	res.send('we are on root');
});

// set PORT to listen to
const PORT = process.env.PORT || 1234;
app.listen(PORT, (err) => {
	if (err) console.error(err);
	console.log(`Server started on port ${PORT} ...`);
});
