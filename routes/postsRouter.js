express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');

//Get all the different posts.
router.get('/', post_controller.all_posts);

//View a specific post.
router.get('/view/:postId', post_controller.view_post)

//Create a new post.
router.post('/createPost', post_controller.create_posts);

//Edit a specific post.
router.post('/editPost', post_controller.edit_post);

//Update a specific post.
router.post('/updatePost/:postId', post_controller.update_post);

//Delete a post.
router.delete('/:postId', post_controller.delete_post);

//Get all the posts in a category (/:category route must be under /editPost because less specific).
router.get('/:category', post_controller.category_posts);

//Get all the posts in a subcategory (/:category/:subcategory route must be under /view/:postId because less specific).
router.get('/:category/:subcategory', post_controller.subCategory_posts);

module.exports = router;