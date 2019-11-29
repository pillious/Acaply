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
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)

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
    // try to get the post & comments
    try {
        var postClassInstance = new PostClass();
        const userClassInstance = new UserClass();

        // get the post from db
        var postDoc = await postClassInstance.getSpecificPost(req.params.postId);

        // get the user profile of the currently logged in user
        var userDocCurrent = await userClassInstance.getUserProfileBySession(req.session.userSessionId)

        // get the user profile of the post author
        var userDocAuthor = await userClassInstance.getUserProfile({"_id": postDoc.post.author})

        // check if current user is the post author
        var isPostAuthor = false;
        if (userDocCurrent._id === postDoc.post.author) {
            isPostAuthor = true;
        }

        // change post author from user's _id to user's username (used to show post author on UI)
        postDoc.post.author = userDocAuthor.username;

        // check each comment if it was created by current user
        for (var i = 0; i < postDoc.comments.length; i++) {

            // add new field to each comment obj (default to false)
            postDoc.comments[i]["isCommentAuthor"] = false;
            if (postDoc.comments[i].author.toString() === userDocCurrent._id.toString()) {
                postDoc.comments[i]["isCommentAuthor"] = true;
            }

            // delete comment's author field (this field contains the author's _id) from comment obj
            delete postDoc.comments[i].author;
        }

        console.log(postDoc.post)
        resp.render('viewPost', { post: postDoc.post, comments: postDoc.comments, isPostAuthor: isPostAuthor})
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
            post: postDoc.post
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
    if (req.session.userSessionId) {
        // use function from modules.js to delete post
        const postClassInstance = new PostClass();
        var postDoc = await postClassInstance.deletePost(req.params.postId)

        resp.send(postDoc)
    }
}

// gets posts from specific category 
exports.category_posts = async function (req, resp) {
    var postClassInstance = new PostClass();
    var posts = await postClassInstance.getCategoryPosts(req.params.category);

    let userDoc;
    // check if user is logged in
    const userClassInstance = new UserClass();
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)
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
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)

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