const express = require('express');
const app = express();
const mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// import db models
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const User = require('./models/User');

const port = process.env.port || 3000;

// connect to the database
mongoose.connect('mongodb://localhost:27017/acaply', {
    useNewUrlParser: true
}).then(function () {
    //This means that the database was successfully connected to.
    console.log("Database connected.");
});

app.use(express.static(__dirname + '/public'));

// set view engine
app.set('views', 'views');
app.set('view engine', 'ejs');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.get('/', async function (req, resp) {

    let postDoc
    // await all posts
    postsDoc = await getAllPosts();

    let userDoc;
    // check if user is logged in
    if (req.session.userSessionId) {
        userDoc = await getUserProfile(req.session.userSessionId)
    }

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: userDoc
    })

});

// async function which retrieves all posts
async function getAllPosts() {
    var posts;
    posts = await Post.find()
    console.log(posts)
    return posts;
}

// async function which retrieves all posts
async function getUserProfile(userSessionId) {
    var userDoc;
    userDoc = await User.findOne({
        "sessionId": userSessionId
    })

    return userDoc
}

// create a new post
app.post('/createPost', function (req, resp) {
    try {
        var postInstance = new Post();
        postInstance.title = req.body.title
        postInstance.text = req.body.body
        postInstance.category = req.body.category
        postInstance.type = req.body.subCategory

        postInstance.save()

        resp.render('viewPost')
    } catch {
        resp.send("post failed")
    }
})

// render the signup page
app.post('/signup', function (req, resp) {
    resp.render('signup');
})

// create a new account & validate
app.post('/createAccount', function (req, resp) {
    try {
        var user = new User(req.body);
        var result = user.save().then(function (doc) {
            resp.send(doc);
        });
    } catch (error) {
        resp.status(500).send(error);
    }
})

//render the login page
app.post('/login', function (req, resp) {
    resp.render('login')
});

// login the user (validates login credentials)
app.post('/loginValidate', function (req, resp) {
    var username = req.body.username;
    var password = req.body.password;

    // validates username & password when logging in
    User.findOne({
            username: username
        })
        .then(async function (userDoc) {
            if (!userDoc) {
                resp.send("The username doesn't exist");
            }

            // check if entered password same as user's db password
            userDoc.comparePassword(password, (error, match) => {
                if (!match) {
                    resp.status(400).send("The password is invalid");
                }
            });


            // -------- Set the session id for the user -----------

            // generate a new, random id
            var sessionId = new mongoose.Types.ObjectId();
            // once credentials validated, set the session id for the user
            req.session.userSessionId = sessionId;

            // set session id in user db doc
            userDoc.sessionId = sessionId;
            await userDoc.save()

            //-----------------------------------------------------

            // await while getting posts
            let postsDoc = await getAllPosts();

            console.log(userDoc)
            // render index page
            resp.render('index', {
                posts: postsDoc,
                user: userDoc
            })

        }).catch(function (err) {
            resp.send(err);
        })
});

// once logged out, destroy the session (user's session id)
app.post('/logout', function (req, resp) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                resp.send(err);
            } else {
                resp.send('Successfully logged out');
            }
        });
    }
    resp.send("Your are not logged in.")
})

app.listen(port, () => console.log(`Acaply listening on ${port}!`));

// include routes
// var routes = require('./routes/router');