const mongoose = require('mongoose');

// import db schemas
const PostSchema = require('../models/Post');
const UserSchema = require('../models/User');

class PostClass {
    // get all posts in db
    async getAllPosts() {
        var posts;
        posts = await PostSchema.find();
        return posts;
    }

    // get posts from a category or subcategory
    async getSpecificPosts(fieldName, fieldValue) {
        console.log(fieldName, fieldValue)
        var posts;
        if (fieldName && fieldValue) {

            // creates an object with fieldName & fieldValue. Search for posts in db which match the search parameter
            var dbSearchParameter = {};
            dbSearchParameter[fieldName] = fieldValue
            console.log(dbSearchParameter);

            posts = await PostSchema.find(dbSearchParameter);
            return posts;
        }

        return posts;
    }

    async createNewPost(req) {
        var postInstance = new PostSchema();

        var userClassInstance = new UserClass();
        var userDoc = await userClassInstance.getUserProfile(req)
        
        // set values of post schema
        postInstance.title = req.body.title
        postInstance.text = req.body.body
        postInstance.category = req.body.category
        postInstance.subCategory = req.body.subCategory
        postInstance.keywords = req.body.keywords.split(",")
        postInstance.author = userDoc._id

        // add new post to db
        await postInstance.save()
        
        return postInstance;
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
    UserClass
};