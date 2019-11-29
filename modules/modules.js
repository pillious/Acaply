const mongoose = require('mongoose');

// import db schemas
const PostSchema = require('../models/Post');
const CommentSchema = require('../models/Comment');
const UserSchema = require('../models/User');

class PostClass {
    // get all posts in db
    async getAllPosts() {
        var posts;
        posts = await PostSchema.find();
        return posts;
    }

    // get posts from a category or subcategory
    async getSubcategoryPosts(category, subcategory) {
        var posts;
        if (category && subcategory) {

            // creates an object with fieldName & fieldValue. Search for posts in db which match the search parameter
            var dbSearchParameters = [{
                "category": category
            }, {
                "subCategory": subcategory
            }];

            // posts = await PostSchema.find(dbSearchParameter);
            posts = await PostSchema.find({
                $and: dbSearchParameters
            })
            return posts;
        }

        return posts;
    }

    // get posts from a category or subcategory
    async getCategoryPosts(category) {
        var posts;
        if (category) {

            // creates an object with fieldName & fieldValue. Search for posts in db which match the search parameter
            var dbSearchParameter = {
                "category": category
            };

            posts = await PostSchema.find(dbSearchParameter)
            return posts;
        }

        return posts;
    }

    // get one specific post & and its comments
    async getSpecificPost(postId) {
        try {

            const dbPostSearchParameter = {
                "_id": postId
            };
            const dbCommentSearchParameter = {
                "parentPost": postId
            }

            // get posts & comments from db
            var post = await PostSchema.findOne(dbPostSearchParameter)
            var comments = await CommentSchema.find(dbCommentSearchParameter)

            return {
                post: post,
                comments: comments
            };
        } catch {
            return {
                post: {},
                comments: []
            };
        }
    }

    async createNewPost(postFields) {
        var postInstance = new PostSchema();

        var userClassInstance = new UserClass();
        var userDoc = await userClassInstance.getUserProfile(req)

        // set values of post schema
        postInstance.title = postFields.title
        postInstance.text = postFields.body
        postInstance.category = postFields.category
        postInstance.subCategory = postFields.subCategory
        postInstance.keywords = postFields.keywords.split(",")
        postInstance.author = userDoc._id

        // add new post to db
        await postInstance.save()

        return postInstance;
    }

    // delete a post
    async deletePost(postId) {
        var post;
        if (postId) {
            // delete post from db using post's _id
            post = await PostSchema.findByIdAndRemove(postId)
            return post;
        }

        return post;
    }
}

class CommentClass {
    // create a new comment for a post
    async createNewComment(commentBody, parentPost, author) {
        try {
            var commentInstance = new CommentSchema();
            commentInstance.body = commentBody;
            commentInstance.parentPost = parentPost;
            commentInstance.author = author;

            var commentDoc = await commentInstance.save()

            return commentDoc;
        } catch {
            return {};
        }
    }

    // get the existing comments for a post
    async getComments(postId) {
        try {
            // search for the comments in the db
            const dbSearchParameter = {
                "parentPost": postId
            };

            var comments = await CommentSchema.find(dbSearchParameter)
            return comments;
        } catch {
            return [];
        }
    }

    // delete a comment
    async deleteComment(commentId) {
        // try to delete comment by comment's _id field
        try {
            var comment = await CommentSchema.findByIdAndRemove(commentId)
            return comment;
        } catch {
            return {};
        }
    }
}

class UserClass {
    // get the user profile
    async getUserProfile(req) {
        var userDoc;
        if (req.session.userSessionId) {
            userDoc = await UserSchema.findOne({
                "sessionId": req.session.userSessionId
            });
        }

        return userDoc;
    }

    // set user's session id to empty string
    async clearUserSessionId(req) {
        var userDoc;
        userDoc = await UserSchema.findOne({
            "sessionId": req.session.userSessionId
        });
        userDoc.sessionId = "";
        userDoc.save()
    }
}

module.exports = {
    PostClass,
    CommentClass,
    UserClass
};