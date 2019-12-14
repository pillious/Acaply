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
exports.login_page = function (req, resp) {
    resp.render('login');
};

//Showing the signup page.
exports.signup_page = function (req, resp) {
    resp.render('signup');
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
                resp.send("The username does not exist in the database.");
            }

            //Check if the entered password is the same as the user password.
            userDoc.comparePassword(password, (error, match) => {
                if (!match) {
                    resp.status(400).send("The password is invalid.");
                }
            });

            //Set the session ID for the user.

            //Generate a new and random ID.
            var sessionId = new mongoose.Types.ObjectId();

            //Once credentials are validated, set the session ID for the user.
            req.session.userSessionId = sessionId;

            //Set the session ID in the user database document.
            userDoc.sessionId = sessionId;
            await userDoc.save();

            //Send the user back to the home page.
            resp.redirect('/')

        }).catch(function (err) {
            resp.send(err);
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