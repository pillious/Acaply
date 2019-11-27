const express = require('express');
const app = express();
const mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// import routes
var postRoutes = require('./routes/postsRouter.js');
var indexRoutes = require('./routes/indexRouter')

// set view engine
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//use sessions for tracking logins
app.use(session({
    // change secret key !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    secret: 'ULqlcX4KcYE9jeS3lnpv',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use('/posts', postRoutes);
app.use('/', indexRoutes)

// connect to the database
mongoose.connect('mongodb://localhost:27017/acaply', {
    useNewUrlParser: true
}).then(function () {
    //This means that the database was successfully connected to.
    console.log("Database connected.");
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Acaply listening on ${port}!`));