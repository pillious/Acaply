const mongoose = require('mongoose');
const CommentSchema = require('../models/Comment');

const {
    PostClass,
    CommentClass,
    UserClass
} = require('../modules/modules');

//Create a new comment.
exports.create_comment = async function (req, resp) {
    if (req.session.userSessionId) {
        // get the user doc (used to get author's id)
        const userClassInstance = new UserClass();
        var userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId);
        console.log(req.body)
        const postId = req.body.params.postId;
        const commentBody = req.body.params.comment;

        // create the comment & save to db
        const commentClassInstance = new CommentClass();
        await commentClassInstance.createNewComment(commentBody, postId, userDoc);

        resp.status(200).send("new comment success!");
    } else {
        resp.status(400).send("new comment failed");
    }
};

//Delete a comment.
exports.delete_comment = async function (req, resp) {
    if (req.session.userSessionId) {
        const commentClassInstance = new CommentClass();
        var commentDoc = await commentClassInstance.deleteComment(req.params.commentId);

        resp.send(commentDoc);
    } else {
        //Redirect the user to the home page.
        resp.redirect('/')
    }
}