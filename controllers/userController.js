const mongoose = require('mongoose');
const UserSchema = require('../models/User');
const jwt = require('jwt-simple');

const {
    UserClass
} = require('../modules/modules');

// mailgun
const mailgun = require("mailgun-js");
const domain = 'sandbox7886b17869f344a4be81bd63f071b106.mailgun.org';
const api_key = process.env.MAILGUN_API_KEY;
const mg = mailgun({
    apiKey: api_key,
    domain: domain
});

// const {
//     EmailHelper
// } = require('../modules/emailHelper');

//Creating a new account.
exports.create_account = async function (req, resp) {
    try {
        var user = new UserSchema(req.body);

        // if new account is created
        if (user) {
            //Set the session ID for the user.
            //Generate a new ID.
            var sessionId = new mongoose.Types.ObjectId();

            //Once credentials are validated, set the session ID for the user.
            req.session.userSessionId = sessionId;

            //Set the session ID in the user database document.
            user.sessionId = sessionId;
            await user.save();

            //Let the user log in.
            resp.status(200).send({
                isLoggedIn: true,
                user: user.username,
                errorCode: null,
                errorMsg: ""
            });
        }
    } catch (err) {
        resp.send({
            isLoggedIn: false,
            user: user.username,
            errorCode: err.code,
            errorMsg: err.errmsg
        });
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
        if (userDoc) {
            username = userDoc.username;
            isLoggedIn = true;
        }
    }
    // resp.redirect('/index')
    resp.render('login', {
        isLoggedIn: isLoggedIn,
        user: username
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
        if (userDoc) {
            username = userDoc.username;
            isLoggedIn = true;
        }
    }
    resp.render('signup', {
        isLoggedIn: isLoggedIn,
        user: username,
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
                        //Generate a new ID.
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

// go to forgot password page
exports.forgot_password = function (req, resp) {
    resp.render("forgotPassword", {
        isLoggedIn: false,
        user: null,
    });
};

// send a password reset email
exports.reset_password_email = async function (req, resp) {
    // const EmailHelperInstance = new EmailHelper('andrewzhlee@gmail.com', 'reset password link...');
    // var returnData = EmailHelperInstance.sendEmail();

    // find user by email
    const userClassInstance = new UserClass();
    var userDoc = await userClassInstance.getUserProfile({
        email: req.body.email
    });

    // if userDoc is null, the email isn't linked to any account
    if (userDoc instanceof UserSchema || userDoc === null) {
        if (userDoc) {
            // create the one time use reset password link
            var payload = {
                id: userDoc._id,
                email: req.body.email
            }

            var secret = userDoc.password + userDoc.createdAt;
            var token;

            try {
                token = jwt.encode(payload, secret);
            }
            catch(err) {
                resp.send({
                    success: false,
                    message: "An error occured while sending you the email. Please try again."
                });
            }

            var link = 'http://localhost:3000/resetPassword/' + userDoc._id + '/' + token;

            // send the email
            var emailData = {
                from: 'Acaply <noreply@acaply.com>',
                to: 'andrewzhlee@gmail.com',
                subject: 'Acaply - Password Reset',
                text: 'Hi ' + userDoc.username + ", click the button below to change your password" + link
            };
            mg.messages().send(emailData, function (error, body) {
                if (error) {
                    resp.send({
                        success: false,
                        message: "An error occured while sending you the email. Please try again."
                    });
                }
                else {
                    resp.send({
                        success: true,
                        message: 'Success! A password reset email has been sent to ' + req.body.email + '.'
                    });
                }
            });


        } else {
            resp.send({
                success: false,
                message: req.body.email + ' is not linked to an account.'
            });
        }
    } else {
        resp.send({
            success: false,
            message: "An error occured while sending you the email. Please try again."
        });
    }

}

// go to reset password page
exports.reset_password_page = async function (req, resp) {
    // find user by _id
    const userClassInstance = new UserClass();
    var userDoc = await userClassInstance.getUserProfile({
        _id: req.params.id
    });

    if (userDoc instanceof UserSchema && userDoc) {
        // recreate the secret key
        var secret = userDoc.password + userDoc.createdAt;
        var payload;

        try {
            // check if the decoded token is the same as the secret key
            payload = jwt.decode(req.params.token, secret);

            resp.render("resetPassword", {
                isLoggedIn: false,
                isLinkValid: true,
                userId: payload.id,
                token: req.params.token
            });
        } catch (err) {
            resp.render("resetPassword", {
                isLoggedIn: false,
                isLinkValid: false,
                userId: null,
                token: null
            });
        }
    } else {
        resp.render("resetPassword", {
            isLoggedIn: false,
            isLinkValid: false,
            userId: null,
            token: null
        });
    }
};

// reset user's password
exports.reset_password = async function (req, resp) {
    // find user by _id
    const userClassInstance = new UserClass();
    var userDoc = await userClassInstance.getUserProfile({
        _id: req.body.userId
    });

    if (userDoc instanceof UserSchema && userDoc) {
        // recreate the secret key
        var secret = userDoc.password + userDoc.createdAt;

        try {
            // check if the decoded token is the same as the secret key
            var payload = jwt.decode(req.body.token, secret);

            // password is auto hashed when a password change is saved (in User.js)
            userDoc.password = req.body.newPassword;
            userDoc.save();

            resp.send({
                passwordChanged: true,
                message: "Your password has been successfully changed."
            });
        } catch (err) {
            resp.send({
                passwordChanged: false,
                message: "This link is no longer valid. Click the button below to generate a new link."
            });
        }
    } else {
        resp.send({
            passwordChanged: false,
            message:  "An error occured while trying to change your password. Click the button below to generate a new link."
        });
    }
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