const mongoose = require('mongoose');
const PostSchema = require('../models/Post');

const categories = require('../modules/categories')

const {
    PostClass,
    UserClass
} = require('../modules/modules');

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

// view one specific post
exports.view_post = async function (req, resp) {
    var postClassInstance = new PostClass();
    var postDoc
    try {
        postDoc = await postClassInstance.getSpecificPost(req.params.postId);
        resp.render('viewPost', { post: postDoc})
    }
    catch {
        resp.send("post not found")
    }
};

// go to createPost page
exports.to_new_post = function (req, resp) {
    resp.render('createPost')
};

// create a new post
exports.create_posts = async function (req, resp) {
    if (req.session.userSessionId) {
        try {
            // save new post on db
            var postClassInstance = new PostClass();
            var newPostDoc = await postClassInstance.createNewPost(req.body);

            resp.redirect('/posts/view/' + newPostDoc._id)
        } catch {
            resp.send("post failed")
        }
    } else {
        resp.redirect('/login')
    }
}

// edit a post
exports.edit_post = async function (req, resp) {
    var postClassInstance = new PostClass();
    // get one specific post 
    try {
        var postDoc = await postClassInstance.getSpecificPost(req.body.postId);
        resp.render('editPost', {
            post: postDoc
        })
    }
    catch {
        resp.redirect('/')
    }

}

// update the post in the db
exports.update_post = async function (req, resp) {
    console.log(req.body)

    const postId = req.params.postId

    const filter = { '_id': postId };
    const update = { 'title': req.body.title, 'text': req.body.body , 'keywords': req.body.keywords.split(',') };

    let updatedPostDoc = await PostSchema.findOneAndUpdate(filter, update, {
        new: true
    });

    resp.redirect('/posts/view/' + updatedPostDoc._id)
}

// delete a post
exports.delete_post = async function (req, resp) {
    // use function from modules.js to delete post
    const postClassInstance = new PostClass();
    userDoc = await postClassInstance.deletePost(req.params.postId)

    resp.send(userDoc)
}

// gets posts from specific category 
exports.category_posts = async function (req, resp) {
    var postClassInstance = new PostClass();
    var posts = await postClassInstance.getCategoryPosts(req.params.category);

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
        posts: posts,
        user: userDoc,
        categories: categories,
        isLoggedIn: isLoggedIn
    })
};

// gets posts from specific subcategory
exports.subCategory_posts = async function (req, resp) {
    var postClassInstance = new PostClass();

    var category = req.params.category
    var subcategory = req.params.subcategory

    var posts = await postClassInstance.getSubcategoryPosts(category, subcategory);

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
        posts: posts,
        user: userDoc,
        categories: categories,
        isLoggedIn: isLoggedIn
    })
};