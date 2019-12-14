const mongoose = require('mongoose');

//Get the database models (schemas).
const PostSchema = require('../models/Post');
const CommentSchema = require('../models/Comment');
const UserSchema = require('../models/User');

//Helper functions.
class PostClass {
    //Get all the posts in the database.
    async getAllPosts() {
        var posts;
        posts = await PostSchema.find().lean();
        return posts;
    }

    //Get posts from a subcategory.
    async getSubcategoryPosts(category, subcategory) {
        var posts;

        if (category && subcategory) {
            //Creates an object with a fieldName and fieldValue.
            //Search for posts in db which match the search parameter
            var dbSearchParameters = [{
                "category": category
            }, {
                "subCategory": subcategory
            }];

            posts = await PostSchema.find({
                $and: dbSearchParameters
            }).lean()
            return posts;
        }

        return posts;
    }

    //Get posts from a category.
    async getCategoryPosts(category) {
        var posts;

        if (category) {

            // creates an object with fieldName & fieldValue. Search for posts in db which match the search parameter
            var dbSearchParameter = {
                "category": category
            };

            posts = await PostSchema.find(dbSearchParameter).lean()
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
            var post = await PostSchema.findOne(dbPostSearchParameter).lean()
            var comments = await CommentSchema.find(dbCommentSearchParameter).lean()

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

    async createNewPost(postFields, userSessionId) {
        var postInstance = new PostSchema();

        var userClassInstance = new UserClass();
        var userDoc = await userClassInstance.getUserProfileBySession(userSessionId)

        // set values of post schema
        postInstance.title = postFields.title
        postInstance.text = postFields.body
        postInstance.category = postFields.category
        postInstance.subCategory = postFields.subCategory
        postInstance.keywords = postFields.keywords.split(",")
        postInstance.author = userDoc._id
        postInstance.authorUsername = userDoc.username

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
    async createNewComment(commentBody, parentPost, authorUserDoc) {
        console.log(authorUserDoc)
        try {
            var commentInstance = new CommentSchema();
            commentInstance.body = commentBody;
            commentInstance.parentPost = parentPost;
            commentInstance.author = authorUserDoc._id;
            commentInstance.authorUsername = authorUserDoc.username

            var commentDoc = await commentInstance.save()

            return commentDoc;
        } catch {
            return {};
        }
    }

    // get the existing comments for a post
    // async getComments(postId) {
    //     try {
    //         // search for the comments in the db
    //         const dbSearchParameter = {
    //             "parentPost": postId
    //         };

    //         var comments = await CommentSchema.find(dbSearchParameter).lean()
    //         return comments;
    //     } catch {
    //         return [];
    //     }
    // }

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
    // get the user profile by session id
    async getUserProfileBySession(sessionId) {
        var userDoc;
        if (sessionId) {
            userDoc = await UserSchema.findOne({
                "sessionId": sessionId
            });
        }

        return userDoc;
    }

    // get user profile (must use getUserProfileBySession for finding user by session id)
    async getUserProfile(dbUserSearchParameter) {
        try {
            var userDoc = await UserSchema.findOne(dbUserSearchParameter);
            return userDoc;
        }
        catch {
            return {};
        }
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