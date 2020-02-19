const mongoose = require('mongoose');
const UserSchema = require('../models/User');

const {
    UserClass
} = require('../modules/modules');

//Creating a new account.
exports.create_account = async function (req, resp) {
    try {
        var user = new UserSchema(req.body);
        var result = await user.save()

        //Let the user log in.
        resp.redirect('/login');
    } catch (error) {
        resp.status(500).send(error);
    }
};

//Showing the login page.
exports.login_page = async function (req, resp) {
    var userDoc;
    var username;
    var isLoggedIn = false;

    // check if user is logged in
    if (req.session.userSessionId) {
        const userClassInstance = new UserClass();
        userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId);
        username = userDoc.username;
        isLoggedIn = true;


    }
    // resp.redirect('/index')
    resp.render('login', {
        isLoggedIn: isLoggedIn,
        user: username,
        showAlert: false,
        alertContent: {
            alertColorClass: "",
            alertMsg: ""
        }
    });
};

//Showing the signup page.
exports.signup_page = async function (req, resp) {
    var userDoc;
    var username;
    var isLoggedIn = false;

    // check if user is logged in
    if (req.session.userSessionId) {
        const userClassInstance = new UserClass();
        userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId);
        username = userDoc.username;
        isLoggedIn = true;
    }
    resp.render('signup', {
        isLoggedIn: isLoggedIn,
        user: username,
        showAlert: false,
        alertContent: {
            alertColorClass: "",
            alertMsg: ""
        }
    });
};

//See if what the user entered is valid.
exports.login_validate = async function (req, resp) {
    var username = req.body.username;
    var password = req.body.password;

    UserSchema.findOne({
            username: username
        })
        .then(async function (userDoc) {
            if (!userDoc) {
                resp.send({
                    isLoggedIn: false,
                    user: username,
                    errorMsg: "Incorrect username or password."
                });
            } else {
                //Check if the entered password is the same as the user password.
                userDoc.comparePassword(password, async (error, match) => {
                    if (!match) {
                        resp.send({
                            isLoggedIn: false,
                            user: username,
                            errorMsg: "Incorrect username or password."
                        });
                    } else {
                        //Set the session ID for the user.
                        //Generate a new and random ID.
                        var sessionId = new mongoose.Types.ObjectId();

                        //Once credentials are validated, set the session ID for the user.
                        req.session.userSessionId = sessionId;

                        //Set the session ID in the user database document.
                        userDoc.sessionId = sessionId;
                        await userDoc.save();

                        resp.send({
                            isLoggedIn: true,
                            user: username,
                            errorMsg: ""
                        })
                    }
                });
            }

        }).catch(function (err) {
            resp.send({
                isLoggedIn: false,
                user: username,
                errorMsg: err
            });
        })
};

//Log the user out.
exports.logout = async function (req, resp) {
    //Once the user is logged out, destroy the session (user session ID).
    if (req.session) {
        //Change the session ID field in the user profile back to an empty string.
        const userClassInstance = new UserClass();
        await userClassInstance.clearUserSessionId(req);

        //Delete the session object.
        req.session.destroy(function (err) {
            if (err) {
                //There was an error destroying the session object.
                resp.send(err);
            } else {
                //Send the user to the home page.
                resp.redirect('/');
            }
        });
    }
};