express = require('express');
var router = express.Router();

//Controllers for the posts and users.
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');

//Default route that is shown when the website is loaded.
router.get('/', post_controller.all_posts)

//Go to the new post page.
router.get('/new', post_controller.to_new_post);

//User and authentication routes are below.

//Go to the login page.
router.get('/login', user_controller.login_page);

//Go to the signup page.
router.get('/signup', user_controller.signup_page);

//Create a new account.
router.post('/createAccount', user_controller.create_account);

//Validate login credentials and log the user in.
router.post('/loginValidate', user_controller.login_validate);

//Log the current user out.
router.post('/logout', user_controller.logout);

module.exports = router;