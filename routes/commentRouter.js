express = require('express');
const router = express.Router();

const comment_controller = require('../controllers/commentController');

router.post('/createComment', comment_controller.create_comment);

router.delete('/:commentId', comment_controller.delete_comment)

module.exports = router;