const mongoose = require('mongoose');

//Get the database models (schemas).
const PostSchema = require('../models/Post');
const CommentSchema = require('../models/Comment');
const UserSchema = require('../models/User');

//Helper functions.
class PostClass {
  //Get all the posts in the database.
  async getAllPosts(sortField, sortOrder) {
    var posts;
    var sortObj = {};
    sortObj[sortField] = sortOrder;
    posts = await PostSchema.find().sort(sortObj).lean();
    return posts;
  }

  //Get posts from a subcategory.
  async getSubcategoryPosts(category, subcategory, sortField, sortOrder) {
    var posts;

    if (category && subcategory) {
      //Creates an object with a fieldName and fieldValue.
      //Search for posts in db which match the search parameter
      var dbSearchParameters = [
        {
          category: category,
        },
        {
          subCategory: subcategory,
        },
      ];

      var sortObj = {};
      sortObj[sortField] = sortOrder;

      posts = await PostSchema.find({
        $and: dbSearchParameters,
      })
        .sort(sortObj)
        .lean();
      return posts;
    }

    return posts;
  }

  // async getPostsByKeyWords(keywords) {
  //     return "coming soon";
  // }

  // get all posts which contain the search string (e.g search string = 'english study guide')
  async getPostsByOneField(fieldKey, fieldValue, sortField, sortOrder) {
    var posts;
    if (fieldKey && fieldValue) {
      // creates an object with fieldName & fieldValue. Search for posts in db which match the search parameter
      var dbSearchParameter = {};
      dbSearchParameter[fieldKey] = fieldValue;

      var sortObj = {};
      sortObj[sortField] = sortOrder;

      posts = await PostSchema.find(dbSearchParameter).sort(sortObj).lean();
      return posts;
    }

    return posts;
  }

  // get one specific post & and its comments
  async getSpecificPost(postId) {
    try {
      const dbPostSearchParameter = {
        _id: postId,
      };
      const dbCommentSearchParameter = {
        parentPost: postId,
      };

      // get posts & comments from db
      var post = await PostSchema.findOne(dbPostSearchParameter).lean();
      var comments = await CommentSchema.find(dbCommentSearchParameter).lean();

      return {
        post: post,
        comments: comments,
      };
    } catch (err) {
      return {
        post: {},
        comments: [],
      };
    }
  }

  // get all posts which contain the search string
  async getPostsBySearchString(dbSearchFields, searchString) {
    var postDoc = [];
    var dbSearchParam = [];
    var regexSearchString = new RegExp(searchString, 'i');

    dbSearchFields.forEach((field) => {
      var paramObj = {};
      paramObj[field] = regexSearchString;
      dbSearchParam.push(paramObj);
    });

    try {
      postDoc = PostSchema.find({ $or: dbSearchParam });
    } catch (err) {
      console.log(err);
    }

    return postDoc;
  }

  async createNewPost(postFields, userSessionId) {
    var postInstance = new PostSchema();

    var userClassInstance = new UserClass();
    var userDoc = await userClassInstance.getUserProfileBySession(
      userSessionId
    );

    // set values of post schema
    postInstance.title = postFields.title;
    postInstance.text = postFields.body;
    postInstance.category = postFields.category;
    postInstance.subCategory = postFields.subCategory;
    postInstance.keywords = postFields.keywords.split(',');
    postInstance.author = userDoc._id;
    postInstance.authorUsername = userDoc.username;

    // add new post to db
    await postInstance.save();

    return postInstance;
  }

  // increase view count of a post by 1
  async incrementPostViews(postId) {
    var postDoc = await PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      }
    ).lean();
    return postDoc;
  }

  // check if user has already voted on a post
  hasUserAlreadyVoted(postId, userDoc) {
    // check if userId is in the array of votes already
    return PostSchema.findOne({
      _id: postId,
      'votes.userId': userDoc._id,
    });
  }

  // update the post score (when a user votes/changes vote on a post)
  updatePostScore(postId, changeInPostScore) {
    return PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          score: changeInPostScore,
        },
      },
      {
        new: true,
      }
    );
  }

  // add/change vote of user (+1, -1, 0)
  addVoteToPost(postId, userDoc, score, newVoter) {
    if (newVoter) {
      return PostSchema.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $push: {
            votes: {
              userId: userDoc._id,
              username: userDoc.username,
              vote: score,
            },
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
    } else {
      return PostSchema.updateOne(
        {
          _id: postId,
          'votes.userId': userDoc._id,
        },
        {
          $set: {
            'votes.$.vote': score,
          },
        },
        {
          new: true,
        }
      );
    }
  }

  // remove user's vote from votes array of a post
  removePostVote(postId, userDoc) {
    return PostSchema.updateOne(
      {
        _id: postId,
        'votes.userId': userDoc._id,
      },
      {
        $pull: {
          votes: {
            userId: userDoc._id,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  // delete a post
  async deletePost(postId) {
    var post;
    if (postId) {
      // delete post from db using post's _id
      post = await PostSchema.findByIdAndRemove(postId);
      return post;
    }

    return post;
  }
}

class CommentClass {
  // create a new comment for a post
  async createNewComment(commentBody, parentPost, authorUserDoc) {
    try {
      var commentInstance = new CommentSchema();
      commentInstance.body = commentBody;
      commentInstance.parentPost = parentPost;
      commentInstance.author = authorUserDoc._id;
      commentInstance.authorUsername = authorUserDoc.username;

      var commentDoc = await commentInstance.save();

      // postDoc after incrementing comments doc
      var updatedPostDoc = await PostSchema.findOneAndUpdate(
        {
          _id: parentPost,
        },
        {
          $inc: {
            comments: 1,
          },
        },
        {
          new: true,
        }
      );

      return commentDoc;
    } catch (err) {
      //Error creating new comment
      console.error(err.message);
    }
  }

  // get a specific comment by its id
  async getComment(commentId) {
    try {
      var comment = await CommentSchema.findById(commentId);
      return comment;
    } catch (err) {
      return {};
    }
  }

  // update the db with edited comment
  async editComment(commentId, commentBody) {
    try {
      var comment = await CommentSchema.findByIdAndUpdate(commentId, {
        body: commentBody,
      });
      return comment;
    } catch (err) {
      return {};
    }
  }

  // delete a comment
  async deleteComment(commentId) {
    // try to delete comment by comment's _id field
    try {
      var comment = await CommentSchema.findByIdAndRemove(commentId);

      return comment;
    } catch (err) {
      return {};
    }
  }

  // delete all the comments from a post
  async deleteCommentsInPost(postId) {
    try {
      var comments = await CommentSchema.deleteMany({ parentPost: postId });
      return comments;
    } catch (err) {
      return [];
    }
  }
}

class UserClass {
  // get the user profile by session id
  async getUserProfileBySession(sessionId) {
    var userDoc;
    if (sessionId) {
      userDoc = await UserSchema.findOne({
        sessionId: sessionId,
      });
    }

    return userDoc;
  }

  // get user profile (must use getUserProfileBySession for finding user by session id)
  async getUserProfile(dbUserSearchParameter) {
    try {
      var userDoc;
      userDoc = await UserSchema.findOne(dbUserSearchParameter);
      return userDoc;
    } catch (err) {
      return err;
    }
  }

  // set user's session id to empty string
  async clearUserSessionId(req) {
    var userDoc;
    userDoc = await UserSchema.findOne({
      sessionId: req.session.userSessionId,
    });
    userDoc.sessionId = '';
    userDoc.save();
  }
}

module.exports = {
  PostClass,
  CommentClass,
  UserClass,
};
