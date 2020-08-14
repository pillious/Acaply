//Require basic dependencies.
const express = require('express');
const mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const moment = require('moment');
var path = require('path');
var favicon = require('serve-favicon');
require('dotenv').config();

//Create the application.
const app = express();

//Import the routes.
var postRoutes = require('./routes/postsRouter');
var commentRoutes = require('./routes/commentRouter');
var indexRoutes = require('./routes/indexRouter');

//Set the view engine (embedded JavaScript templates).
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');

// momentjs local var (can be accessed by any EJS scripts)
app.locals.moment = moment; // this makes moment available as a variable in every EJS page

//The public folder serves static files such as images, CSS files, and JavaScript files.
app.use(express.static(__dirname + '/public'));

app.use(favicon(__dirname + '/public/images/favicon_files/favicon.ico'));

//Parse the URL-encoded bodies (as sent by HTML forms).
app.use(express.urlencoded({ extended: true }));

//Parse the JSON bodies (as sent by API clients).
app.use(express.json());

// Use cors
app.use(cors());

//Use sessions for tracking user logins.
//A session is a storage that consists of information on server-side.
const sessionSecret = process.env.USER_SESSION_KEY;
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

//Configure more middleware (routes).
app.use('/posts', postRoutes);
app.use('/comment', commentRoutes);
app.use('/', indexRoutes);

const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;

//Connect to the MongoDB database.
mongoose
  .connect(
    'mongodb+srv://' +
      dbUsername +
      ':' +
      dbPassword +
      '@nnhs-forum-tqvkq.azure.mongodb.net/acaply?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(function () {
    //This means that the database was successfully connected to.
    console.log('Database connected.');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB.', err);
  });

//Set the port number.
const port = process.env.PORT || 3000;

//Run the application on the specified port.
app.listen(port, () => console.log(`Acaply listening on port ${port}.`));
