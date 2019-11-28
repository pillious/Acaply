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

    var isLoggedIn = false;

    if (userDoc) {
        isLoggedIn = true;
    }

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: userDoc,
        categories: categories,
        isLoggedIn: isLoggedIn
    })
};

// gets posts from specific category 
exports.category_posts = async function(req, resp) {
    var postClassInstance = new PostClass();

    var category = req.path.split('/').pop()
    var posts = await postClassInstance.getCategoryPosts(category);

    resp.send(posts);
};

// gets posts from specific subcategory
exports.subCategory_posts = async function(req, resp) {
    var postClassInstance = new PostClass();

    var category = req.path.split('/')[1]
    var subcategory = req.path.split('/')[2]
    var posts = await postClassInstance.getSubcategoryPosts(category, subcategory);

    resp.send(posts);
};

// go to createPost page
exports.to_new_post = function (req, resp) {
    resp.render('createPost')
};

// create a new post
exports.create_posts = async function(req, resp) {
    if (req.session.userSessionId) {
        try {
            // save new post on db
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

exports.view_post = function(req, resp) {
    resp.send("view post not implemented yet. COMING SOON!")
};