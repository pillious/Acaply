express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');

// default route used on website load
router.get('/', post_controller.all_posts)

// ---- user & auth related routes ----

// go to login page
router.get('/login', user_controller.login_page);

//go to signup page
router.get('/signup', user_controller.signup_page);

// create a new account
router.post('/createAccount', user_controller.create_account);

// validate login credentials & log user in
router.post('/loginValidate', user_controller.login_validate);

// log current use out
router.post('/logout', user_controller.logout);

module.exports = router;