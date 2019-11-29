const mongoose = require('mongoose');
const CommentSchema = require('../models/Comment');

// const categories = require('../modules/categories')

const {
    PostClass,
    CommentClass,
    UserClass
} = require('../modules/modules');

// create a new comment
exports.create_comment = async function (req, resp) {
    if (req.session.userSessionId) {
        // get the user doc (used to get author's id)
        const userClassInstance = new UserClass();
        var userDoc = await userClassInstance.getUserProfile(req);

        const postId = req.body.postId;
        const commentBody = req.body.comment;

        // create the comment & save to db
        const commentClassInstance = new CommentClass();
        await commentClassInstance.createNewComment(commentBody, postId, userDoc._id);

        resp.redirect('/posts/view/' + postId);
    }
    else {
        resp.redirect('/login');
    }
};

// delete a comment
exports.delete_comment = async function (req, resp) { 
    if (req.session.userSessionId) {
        const commentClassInstance = new CommentClass();
        var commentDoc = await commentClassInstance.deleteComment(req.params.commentId);

        resp.send(commentDoc);
    }
    else {
        resp.redirect('/')
    }
}

