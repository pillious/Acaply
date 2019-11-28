express = require('express');
var router = express.Router();

var post_controller = require('../controllers/postController');

// less specific routes go to bottom

// get all posts (/posts)
router.get('/', post_controller.all_posts);

// view one specific post
router.get('/view/:postId', post_controller.view_post)

// create a new post
router.post('/createPost', post_controller.create_posts);

// edit a post (edit post title & body text & keywords)
router.post('/editPost', post_controller.edit_post);

// edit a post (edit post title & body text)
router.post('/updatePost/:postId', post_controller.update_post);

// delete a post
router.delete('/:postId', post_controller.delete_post);

// get all posts in a category (e.g classes, updates) (/posts/classes)
// /:category route must go under /editPost because it's less specific
router.get('/:category', post_controller.category_posts);

// get all posts in a subcategory (e.g. events, english, math) (/posts/classes/english)
// /:category/:subcategory route must be under /view/:postId because it's less specific
router.get('/:category/:subcategory', post_controller.subCategory_posts);

module.exports = router;
