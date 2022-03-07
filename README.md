# DIGITAL FACTORY PEACH STORE CODING CHALLENGE

## Endpoints

- GET `/api/songs` - (Public route) receive the list of the songs available in the library for purchase
- POST `/api/songs` - (Public route) to add songs to the library, hit this endpoint by providing in the request body an object with the following properties `name, artist, album, price`
  - (NOTE : `/api/songs` route is set to public in order to be able to create the library of songs, so we have data to work with, this route of course should be private and only accessible by Peach Store Administrators)
- POST `/api/signup` - (Public route) to signup, hit this endpoint by providing in the request body an object with the following properties `firstName, lastName, phoneNumber, username, email, password`, the user should receive a JWT Token to use to hit the private routes
- POST `/api/login` - (Public route) to log in, hit this endpoint by providing in the request body an object with the following properties `userNameOrEmail, password`, the user should receive a JWT Token to use to hit the private routes
- POST `/api/purchase-song` (Private route - user must be authenticated by providing the JWT Token) to purchase a new song available in the library, hit this endpoint by providing in the request body an object with the following property `idSong` , IDs of the possible songs to purchase can be found when hitting GET `/api/songs`
- POST `/api/my-purchased-songs` - (Private route - user must be authenticated by providing the JWT Token) to get the list of currently logged users' purchases with the purchases details and the total price of all the purchases
- POST `/api/my-purchased-song` - (Private route - user must be authenticated by providing the JWT Token) to get the currently logged users' purchase with the purchase details and the total price of all the purchases

## Project structure

- `helpers/`: holds usefull functions that can be used all-over the project
- `middlawres/`: folder containing Express middlewares which process the incoming requests before handling them down to the routes, currently holds the auth middleware to allow access to private routes only to logged users
- `models/`: holds the data schemas definitions
- `routes/api/`: holds the possible routes the Rest API can provide
- `tests/Rest API/`: holds insctructions on how to hit properly the endpoints, also can be used to test the endpoints (but first this server should be deployed)
- `database.js`: file that sets up the connection to the MongoDB Atlass (in the cloud)
- `server.js`: file that sets up & initializes the server, and glues everything together
- `.env`: hidden file which contains the environment variables such as :
  - `DB_CONNECTION` that holds the url to connect to the Mongo Database
  - `jwtSecret` that holds the private string to verify JWT Tokens
  - `PORT` that holds the port to use to run the server
  - (NOTE : When deployed, these environment variables should be set manually)

## Lessons learned

- Mongoose: use the `ref` keyword to specify that an ObjectID in a document refers to another document in another collection
- Mongoose: use the `$or` operator when performing searches in the database
- Mongoose: use the `populate()` method to make joins between collections
- convert `Promises` into `async await` syntax to reduce and clean the code
- handle signups and logins

## Steps I took to solve this challenge

1. set up a basic Express server
1. set up a MongoDB database (MongoDB Atlass in the cloud)
1. set up nodemon for faster development experience
1. set up login and sign up routes
1. set up the authentification middleware
1. set up purchase song route
1. set up users' purchased songs route
1. set up users' purchased individual song route
1. added simple form validation when signing up
1. converted the `callback` and `Promises` codes into `async await` syntax
1. added Rest API Requests examples by exporting Postman's requests collection
1. writting this README

check the commits history for more details

## Final Note

- I had a lot of fun solving this challenge, learned a lot of new things. and yes during the 4 hours lapse I managed only to finish the SPEC 1 only, but I just can't let something unfinished, so I decided to finish all the SPECS and try to craft the best code I could
- Hope my solution will meet your expectations
- Built with <3 and excitement by @salimdellali
