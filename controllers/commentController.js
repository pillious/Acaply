const mongoose = require('mongoose');
const CommentSchema = require('../models/Comment');

const { PostClass, CommentClass, UserClass } = require('../modules/modules');

//Create a new comment.
exports.create_comment = async function (req, resp) {
  if (req.session.userSessionId) {
    // get the user doc (used to get author's id)
    const userClassInstance = new UserClass();
    var userDoc = await userClassInstance.getUserProfileBySession(
      req.session.userSessionId
    );

    const postId = req.body.params.postId;
    const commentBody = req.body.params.comment;

    if (commentBody.replace(/^\s+|\s+$/g, '').length == 0) {
      console.log('Comment is blank.');
      resp.redirect('/');
    } else {
      // create the comment & save to db
      const commentClassInstance = new CommentClass();
      await commentClassInstance.createNewComment(commentBody, postId, userDoc);

      resp.status(200).send('new comment success!');
    }
  } else {
    resp.status(400).send('new comment failed');
  }
};

//Edit an existing comment
exports.edit_comment = async function (req, resp) {
  if (req.session.userSessionId) {
    // get the user doc (used to get author's id)
    const userClassInstance = new UserClass();
    var userDoc = await userClassInstance.getUserProfileBySession(
      req.session.userSessionId
    );

    const commentId = req.body.params.commentId;
    const commentBody = req.body.params.commentBody.trim();

    // save the edited comment to db
    const commentClassInstance = new CommentClass();
    const commentDoc = await commentClassInstance.getComment(commentId);

    // check if original comment author is the same as the user who edited the comment
    if (commentDoc.author.toString() === userDoc._id.toString()) {
      // update edit to db
      var updatedCommentDoc = await commentClassInstance.editComment(
        commentId,
        commentBody
      );
      updatedCommentDoc
        ? resp.status(200).send('edit comment success!')
        : resp.status(400).send('edit comment failed');
    } else {
      resp.status(400).send('edit comment failed');
    }
  } else {
    resp.status(400).send('edit comment failed');
  }
};

//Delete a comment.
exports.delete_comment = async function (req, resp) {
  if (req.session.userSessionId) {
    const commentClassInstance = new CommentClass();
    var commentDoc = await commentClassInstance.deleteComment(
      req.params.commentId
    );

    resp.send(commentDoc);
  } else {
    //Redirect the user to the home page.
    resp.redirect('/');
  }
};
