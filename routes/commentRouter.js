express = require('express');
const router = express.Router();

const comment_controller = require('../controllers/commentController');

router.post('/createComment', comment_controller.create_comment);

module.exports = router;