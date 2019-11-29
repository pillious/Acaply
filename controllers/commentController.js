const mongoose = require('mongoose');
const PostSchema = require('../models/Post');

// const categories = require('../modules/categories')

const {
    PostClass,
    UserClass
} = require('../modules/modules');

// create a new comment
exports.create_comment = async function (req, resp) {
    console.log(req.body.comment)
    resp.send("create comment ")
};

// display the comments for a post
exports.show_comments = async function (req, resp) {
    resp.send("Show comments")
};