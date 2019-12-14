//Require basic dependencies.
const express = require('express');
const mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//Create the application.
const app = express();

//Import the routes.
var postRoutes = require('./routes/postsRouter');
var commentRoutes = require('./routes/commentRouter');
var indexRoutes = require('./routes/indexRouter');

//Set the view engine (embedded JavaScript templates).
app.set('views', 'views');
app.set('view engine', 'ejs');

//The public folder serves static files such as images, CSS files, and JavaScript files.
app.use(express.static(__dirname + '/public'));

//Parse the URL-encoded bodies (as sent by HTML forms).
app.use(express.urlencoded());

//Parse the JSON bodies (as sent by API clients).
app.use(express.json());

//Use sessions for tracking user logins.
//A session is a storage that consists of information on server-side.
app.use(session({
    //Super secret code.
    secret: 'ULqlcX4KcYE9jeS3lnpv',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

//Configure more middleware (routes).
app.use('/posts', postRoutes);
app.use('/comment', commentRoutes);
app.use('/', indexRoutes);

//Connect to the MongoDB database.
//At the moment, we have our local MongoDB databases on our separate computers.
mongoose.connect('mongodb://localhost:27017/acaply', {
    useNewUrlParser: true
}).then(function() {
    //This means that the database was successfully connected to.
    console.log("Database connected.");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

//Set the port number.
const port = process.env.port || 3000;

//Run the application on the specified port.
app.listen(port, () => console.log(`Acaply listening on port ${port}.`));