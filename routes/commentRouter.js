express = require('express');
const router = express.Router();

//Controller for the comments.
const comment_controller = require('../controllers/commentController');

//Creating a comment.
router.post('/createComment', comment_controller.create_comment);

router.post('/editComment', comment_controller.edit_comment)

//Deleting a comment.
router.delete('/:commentId', comment_controller.delete_comment);

module.exports = router;