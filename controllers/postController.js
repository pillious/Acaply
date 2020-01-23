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

    var postsDoc;
    if (req.headers['sort-field'] && req.headers['sort-order']) {
        postsDoc = await postClassInstance.getAllPosts(req.headers['sort-field'], req.headers['sort-order'])
    } else {
        // defaults to getting posts by descending score (highest score -> lowest score)
        postsDoc = await postClassInstance.getAllPosts('score', 'descending');
    }

    let userDoc;
    // check if user is logged in
    const userClassInstance = new UserClass();
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)
    var username;

    var isLoggedIn = false;

    if (userDoc) {
        isLoggedIn = true;
        username = userDoc.username
    }


    // check each post for if current user is owner of the post
    for (var i = 0; i < postsDoc.length; i++) {
        if (isLoggedIn) {
            postsDoc[i]["isPostAuthor"] = false;
            if (postsDoc[i].author.toString() === userDoc._id.toString()) {
                postsDoc[i]["isPostAuthor"] = true;
            }
        }

        // delete user _id from post docs
        delete postsDoc[i].author;

        for (vote in postsDoc[i].votes) {
            delete postsDoc[i].votes[vote].userId;
        }
    }

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: username,
        categories: categories,
        currentCategory: 'all',
        currentSubcategory: 'none',
        postsType: 'all',
        allowCreatePost: true,
        sortField: (req.headers['sort-field'] ? req.headers['sort-field'] : 'score'),
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

        var isLoggedIn = false;
        var username;
        // check if current user is the post author
        var isPostAuthor = false;
        if (userDocCurrent) {
            isLoggedIn = true;
            username = userDocCurrent.username

            if (userDocCurrent._id === postDoc.post.author) {
                isPostAuthor = true;
            }
        }

        // check each comment if it was created by current user
        for (var i = 0; i < postDoc.comments.length; i++) {

            // add new field to each comment obj (default to false)
            postDoc.comments[i]["isCommentAuthor"] = false;
            if (postDoc && userDocCurrent && (postDoc.comments[i].author.toString() === userDocCurrent._id.toString())) {
                postDoc.comments[i]["isCommentAuthor"] = true;
            }

            // delete comment's author field (this field contains the author's _id) from comment obj
            delete postDoc.comments[i].author;
        }

        // increase views of post by 1
        // returns the newly updated postDoc (postDocUpdated includes the incremented views count)
        var postDocUpdated = await postClassInstance.incrementPostViews(postDoc.post._id);

        // delete post author's _id
        delete postDocUpdated.author;

        // delete userId from each coment
        for (vote in postDocUpdated.votes) {
            delete postDocUpdated.votes[vote].userId;
        }

        resp.render('viewPost', {
            post: postDocUpdated,
            user: username,
            categories: categories,
            comments: postDoc.comments,
            allowCreatePost: false,
            isPostAuthor: isPostAuthor,
            isLoggedIn: isLoggedIn
        })
    } catch (err) {
        resp.send(err)
    }
};

// go to createPost page
exports.to_new_post = async function (req, resp) {
    if (req.session.userSessionId) {
        let userDoc;
        // check if user is logged in
        const userClassInstance = new UserClass();
        userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)
        var username;

        var isLoggedIn = false;

        if (userDoc) {
            isLoggedIn = true;
            username = userDoc.username
        }

        resp.render('createPost', {
            category: req.body.category,
            isLoggedIn: isLoggedIn,
            user: username,
            subCategory: req.body.subcategory
        })
    } else {
        resp.redirect('/login')
    }
};

// create a new post
exports.create_post = async function (req, resp) {
    if (req.session.userSessionId) {
        try {
            // save new post on db
            var postClassInstance = new PostClass();
            var newPostDoc = await postClassInstance.createNewPost(req.body, req.session.userSessionId);

            resp.redirect('/posts/view/' + newPostDoc._id)
        } catch (err) {
            resp.send("post failed")
        }
    } else {
        resp.redirect('/login')
    }
}

// edit a post
exports.edit_post = async function (req, resp) {
    var postClassInstance = new PostClass();
    var userClassInstance = new UserClass();
    let userDoc;
    var isLoggedIn;
    // get one specific post 
    if (req.session.userSessionId) {
        try {
            // check if user is logged in
            userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)
            var username;

            isLoggedIn = false;

            if (userDoc) {
                isLoggedIn = true;
                username = userDoc.username
            }

            var postDoc = await postClassInstance.getSpecificPost(req.body.postId);

            if (postDoc) {
                resp.render('editPost', {
                    post: postDoc.post,
                    isLoggedIn: isLoggedIn,
                    user: username,
                    postDoc: postDoc.post
                })
            } else {
                resp.send('error getting post to edit');
            }
        } catch (err) {
            resp.redirect('/');
        }
    } else {
        resp.redirect('/login');
    }
}

// update the post in the db
exports.update_post = async function (req, resp) {

    const postId = req.params.postId

    const filter = {
        '_id': postId
    };
    const update = {
        'title': req.body.title,
        'text': req.body.body,
        'keywords': req.body.keywords.split(',')
    };

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

// upvote or downvote a post
exports.vote_post = async function (req, resp) {
    const userClassInstance = new UserClass();
    const postClassInstance = new PostClass();
    var userDoc;
    var isLoggedIn = false;

    // check if user is logged in
    if (req.session.userSessionId) {
        userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId);
        isLoggedIn = true;
        var isNewVoter = false;

        try {
            // set the vote score depending on upvote or downvote
            var voteScore = 1;
            if (req.path.includes('downVote')) {
                voteScore = -1;
            }

            // returns a post doc if user has already voted on a specific post, returns null if user hasn't voted that post before
            var beforeUpdatePostDoc = await postClassInstance.hasUserAlreadyVoted(req.params.postId, userDoc)

            // true = user hasn't voted on specific post before
            if (!beforeUpdatePostDoc) {
                isNewVoter = true;
            }

            // addVoteToPost(str postId, str userDoc, num voteScore, bool newVote)
            var postDoc = await postClassInstance.addVoteToPost(req.params.postId, userDoc, voteScore, isNewVoter);

            // if not a new voter, post overall score changes by 2
            // else, post overall score changes by 1
            if (!isNewVoter) {
                await postClassInstance.updatePostScore(req.params.postId, voteScore * 2)
            } else {
                await postClassInstance.updatePostScore(req.params.postId, voteScore)
            }
        } catch (err) {
            console.log(err)
        }
    }
    resp.send({
        isLoggedIn: isLoggedIn,
        isNewVoter: isNewVoter
    });
}

// remove an upvote or downvote from a post
exports.removeVote_post = async function (req, resp) {
    const userClassInstance = new UserClass();
    const postClassInstance = new PostClass();
    var userDoc;
    var isLoggedIn = false;

    // check if user is logged in
    if (req.session.userSessionId) {
        userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId);
        isLoggedIn = true;

        try {
            // return the postDoc of the post user just voted on
            var postDoc = await postClassInstance.hasUserAlreadyVoted(req.params.postId, userDoc)

            // update the post's total score
            for (vote in postDoc.votes) {
                if (postDoc.votes[vote].userId.toString() === userDoc._id.toString()) {
                    await postClassInstance.updatePostScore(req.params.postId, postDoc.votes[vote].vote * -1);
                    break;
                }
            }

            // remove user from the votes array of a post
            await postClassInstance.removePostVote(req.params.postId, userDoc);

        } catch (err) {
            console.log(err)
        }
    }

    resp.send({
        isLoggedIn: isLoggedIn,
        isNewVoter: true
    });
}

// remove an upvote or downvote from a post
exports.search_string_posts = async function (req, resp) {
    var postClassInstance = new PostClass();

    var searchString = req.path.replace('/search/', '').replace(/-/g, ' ');

    // check if any of these fields contain the search string
    const dbSearchFields = ["authorUsername", "keywords", "title", "text"];

    var postsDoc = await postClassInstance.getPostsBySearchString(dbSearchFields, searchString);

    let userDoc;
    // check if user is logged in
    const userClassInstance = new UserClass();
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)
    var isLoggedIn = false;

    var username = null;
    if (userDoc) {
        isLoggedIn = true;
        username = userDoc.username
    }

    // check each post for if current user is owner of the post
    for (var i = 0; i < postsDoc.length; i++) {
        if (isLoggedIn) {
            postsDoc[i]["isPostAuthor"] = false;
            if (postsDoc[i].author.toString() === userDoc._id.toString()) {
                postsDoc[i]["isPostAuthor"] = true;
            }
        }

        // delete user _id from post docs
        delete postsDoc[i].author;

        for (vote in postsDoc[i].votes) {
            delete postsDoc[i].votes[vote].userId;
        }
    }

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: username,
        categories: categories,
        currentCategory: 'search',
        currentSubcategory: 'none',
        postsType: 'search',
        allowCreatePost: false,
        sortField: (req.headers['sort-field'] ? req.headers['sort-field'] : 'score'),
        isLoggedIn: isLoggedIn
    })
}

// remove an upvote or downvote from a post
exports.author_posts = async function (req, resp) {
    var postClassInstance = new PostClass();
    var postsDoc = await postClassInstance.getPostsByOneField("authorUsername", req.params.authorUsername);

    let userDoc;
    // check if user is logged in
    const userClassInstance = new UserClass();
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)
    var isLoggedIn = false;

    var username = null;
    if (userDoc) {
        isLoggedIn = true;
        username = userDoc.username
    }

    // check each post for if current user is owner of the post
    for (var i = 0; i < postsDoc.length; i++) {
        if (isLoggedIn) {
            postsDoc[i]["isPostAuthor"] = false;
            if (postsDoc[i].author.toString() === userDoc._id.toString()) {
                postsDoc[i]["isPostAuthor"] = true;
            }
        }

        // delete user _id from post docs
        delete postsDoc[i].author;

        for (vote in postsDoc[i].votes) {
            delete postsDoc[i].votes[vote].userId;
        }
    }

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: username,
        categories: categories,
        currentCategory: 'search',
        currentSubcategory: 'none',
        postsType: 'search',
        allowCreatePost: false,
        sortField: (req.headers['sort-field'] ? req.headers['sort-field'] : 'score'),
        isLoggedIn: isLoggedIn
    })
}

// gets posts from specific category 
exports.category_posts = async function (req, resp) {
    var postClassInstance = new PostClass();
    var postsDoc;

    if (req.headers['sort-field'] && req.headers['sort-order']) {
        postsDoc = await postClassInstance.getPostsByOneField("category", req.params.category, req.headers['sort-field'], req.headers['sort-order']);
    } else {
        // defaults to getting posts by descending score (highest score -> lowest score)
        postsDoc = await postClassInstance.getPostsByOneField("category", req.params.category, 'score', 'descending');
    }

    let userDoc;
    // check if user is logged in
    const userClassInstance = new UserClass();
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)
    var isLoggedIn = false;

    var username = null;
    if (userDoc) {
        isLoggedIn = true;
        username = userDoc.username
    }

    // check each post for if current user is owner of the post
    for (var i = 0; i < postsDoc.length; i++) {
        if (isLoggedIn) {
            postsDoc[i]["isPostAuthor"] = false;
            if (postsDoc[i].author.toString() === userDoc._id.toString()) {
                postsDoc[i]["isPostAuthor"] = true;
            }
        }

        // delete user _id from post docs
        delete postsDoc[i].author;

        for (vote in postsDoc[i].votes) {
            delete postsDoc[i].votes[vote].userId;
        }
    }

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: username,
        categories: categories,
        currentCategory: req.params.category,
        currentSubcategory: 'none',
        postsType: 'category',
        allowCreatePost: true,
        sortField: (req.headers['sort-field'] ? req.headers['sort-field'] : 'score'),
        isLoggedIn: isLoggedIn
    })
};

// gets posts from specific subcategory
exports.subCategory_posts = async function (req, resp) {
    var postClassInstance = new PostClass();

    var category = req.params.category
    var subCategory = req.params.subcategory

    var postsDoc = await postClassInstance.getSubcategoryPosts(category, subCategory);

    let userDoc;
    // check if user is logged in
    const userClassInstance = new UserClass();
    userDoc = await userClassInstance.getUserProfileBySession(req.session.userSessionId)

    var isLoggedIn = false;

    var username = null;
    if (userDoc) {
        isLoggedIn = true;
        username = userDoc.username
    }

    // check each post for if current user is owner of the post
    for (var i = 0; i < postsDoc.length; i++) {
        if (isLoggedIn) {
            postsDoc[i]["isPostAuthor"] = false;
            if (postsDoc[i].author.toString() === userDoc._id.toString()) {
                postsDoc[i]["isPostAuthor"] = true;
            }
        }

        // delete user _id from post docs
        delete postsDoc[i].author;

        for (vote in postsDoc[i].votes) {
            delete postsDoc[i].votes[vote].userId;
        }
    }

    // render once posts are returned by getAllPosts()
    resp.render('index', {
        posts: postsDoc,
        user: username,
        categories: categories,
        currentCategory: category,
        currentSubcategory: subCategory,
        postsType: 'subcategory',
        allowCreatePost: true,
        sortField: (req.headers['sort-field'] ? req.headers['sort-field'] : 'score'),
        isLoggedIn: isLoggedIn
    })
};