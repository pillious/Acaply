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
        postInstance.title = req.body.title
        postInstance.text = req.body.body
        postInstance.category = req.body.category
        postInstance.type = req.body.subCategory

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
}

module.exports = {
    PostClass,
    UserClass
};