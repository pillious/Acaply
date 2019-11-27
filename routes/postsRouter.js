express = require('express');
var router = express.Router();

var post_controller = require('../controllers/postController');

// get all posts (/posts)
router.get('/', post_controller.all_posts);

// get all posts in a category (e.g classes, updates) (/posts/classes)
router.get('/:category', post_controller.category_posts);

// get all posts in a subcategory (e.g. events, english, math) (/posts/classes/english)
router.get('/:category/:subcategory', post_controller.subCategory_posts);

// create a new post
router.post('/createPost', post_controller.create_posts);

module.exports = router;
