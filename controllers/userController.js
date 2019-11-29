const mongoose = require('mongoose');
const UserSchema = require('../models/User');

const {
    UserClass
} = require('../modules/modules');

// create a new account
exports.create_account = async function (req, resp) {
    try {
        var user = new UserSchema(req.body);
        var result = await user.save()

        resp.redirect('/login');
    } catch (error) {
        resp.status(500).send(error);
    }
};

exports.login_page = function (req, resp) {
    resp.render('login')
};

exports.signup_page = function (req, resp) {
    resp.render('signup')
};

exports.login_validate = async function (req, resp) {
    var username = req.body.username;
    var password = req.body.password;

    // validates username & password when logging in
    UserSchema.findOne({
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

            resp.redirect('/')

        }).catch(function (err) {
            resp.send(err);
        })
};

// log user out
exports.logout = async function (req, resp) {
    // once logged out, destroy the session (user's session id)
    if (req.session) {
        // change session id field in user profile back to empty string
        const userClassInstance = new UserClass();
        await userClassInstance.clearUserSessionId(req)

        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                resp.send(err);
            } else {
                resp.redirect('/');
            }
        });

    }
    // resp.redirect("/")
};