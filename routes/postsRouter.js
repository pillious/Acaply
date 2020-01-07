express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');

//Get all the different posts.
router.get('/', post_controller.all_posts);

// sort posts
router.get('/sortAllPosts', post_controller.all_posts);
router.get('/sortCategoryPosts', post_controller.category_posts);
router.get('/sortSubcategoryPosts', post_controller.subCategory_posts);
// router.get('/sortSearch', post_controller.all_posts);

//View a specific post.
router.get('/view/:postId', post_controller.view_post)

//Create a new post.
router.post('/createPost', post_controller.create_post);

//Edit a specific post.
router.post('/editPost', post_controller.edit_post);

//Update a specific post.
router.post('/updatePost/:postId', post_controller.update_post);

//Delete a post.
router.delete('/:postId', post_controller.delete_post);

// vote on post (upvote, downvote, removevote)
router.post('/vote/upVote/:postId', post_controller.vote_post);
router.post('/vote/downVote/:postId', post_controller.vote_post);
router.post('/vote/removeVote/:postId', post_controller.removeVote_post);

// Get all posts which contain the search string
router.get('/search/:searchString', post_controller.search_string_posts)

// Get all posts by a specific user
router.get('/user/:authorUsername', post_controller.author_posts)

//Get all the posts in a category (/:category route must be under /editPost because less specific).
router.get('/:category', post_controller.category_posts);

//Get all the posts in a subcategory (/:category/:subcategory route must be under /view/:postId because less specific).
router.get('/:category/:subcategory', post_controller.subCategory_posts);


module.exports = router;