const mongoose = require('mongoose');
const PostSchema = require('../models/Post');

const categories = require('../modules/categories')

const {PostClass, UserClass} = require('../modules/modules');

// gets all posts in db
exports.all_posts = async function (req, resp) {
    const postClassInstance = new PostClass();
    var postsDoc = await postClassInstance.getAllPosts()

    let userDoc;
    // check if user is logged in
    const userClassInstance = new UserClass();
    userDoc = await userClassInstance.getUserProfile(req)

    console.log(categories["Updates"])

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: userDoc,
        categories: categories
    })
};

// gets posts from specific category 
exports.category_posts = async function(req, resp) {
    var postClassInstance = new PostClass();
    var posts = await postClassInstance.getSpecificPosts("category", req.path.split('/').pop());

    resp.send(posts);
};

// gets posts from specific subcategory
exports.subCategory_posts = async function(req, resp) {
    var postClassInstance = new PostClass();

    // check if category exists before searching for subCategory <-------------------------------
    var posts = await postClassInstance.getSpecificPosts("subCategory", req.path.split('/').pop());

    resp.send(posts);
};

// create a new post
exports.create_posts = async function(req, resp) {
    if (req.session.userSessionId) {
        try {
            var postClassInstance = new PostClass();
            var newPostDoc = await postClassInstance.createNewPost(req);
            resp.render('viewPost', {postDoc: newPostDoc})
        } catch {
            resp.send("post failed")
        }
    }
    else {
        resp.redirect('/login')
    }
}

// exports.view_posts = function(req, resp) {
//     resp.render()
// };