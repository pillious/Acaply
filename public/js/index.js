//This function runs when a user tries to delete their post.
function deletePost(postId) {
    var confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        axios.delete("http://localhost:3000/posts/" + postId).then(resp => {
            location.reload();
        }).catch(err => {
            console.log(err);
        })
    }
}

//This function runs when a user tries to delete their comment.
function deleteComment(commentId) {
    var confirmDelete = confirm("Are you sure you want to delete this comment?");
    if (confirmDelete) {
        axios.delete("http://localhost:3000/comment/" + commentId).then(resp => {
            location.reload();
        }).catch(err => {
            console.log(err);
        })
    }
}

// upvote a post
function voteOnPost(element, postId, voteType) {
    // list of the selected element's classes
    var elementClassList = element.classList;

    // corresponding score counter to the vote-btn clicked
    var postScoreCounter = element.parentElement.parentElement.childNodes[3];

    // disable all voting btns until response to request
    $("i.vote-icon").attr("disabled", true);

    // check if user is adding a vote or removing a vote
    if (elementClassList.contains('vote-clicked')) {
        // send voting info to db (remove a vote)
        axios.post("http://localhost:3000/posts/vote/removeVote/" + postId).then(resp => {
            if (resp.data.isLoggedIn) {
                // remove class 'vote-clicked' to make arrow gray
                elementClassList.remove('vote-clicked');

                // change score counter for post
                var postScoreCounter = element.parentElement.parentElement.childNodes[3];
                if (voteType === "upVote") {
                    postScoreCounter.innerHTML = parseInt(postScoreCounter.innerHTML) - 1;
                } else {
                    postScoreCounter.innerHTML = parseInt(postScoreCounter.innerHTML) + 1;
                }


            } else {
                alert("Please login before voting on posts.");
            }
            $("i.vote-icon").attr("disabled", false);
        }).catch(err => {
            $("i.vote-icon").attr("disabled", false);
            console.log(err);
        });
    } else {
        // send voting info to db (add a vote, up/down vote)
        axios.post("http://localhost:3000/posts/vote/" + voteType + "/" + postId).then(resp => {
            if (resp.data.isLoggedIn) {
                // add the class 'vote-clicked' to make arrow orange
                elementClassList.add('vote-clicked');

                // remove the vote-clicked from the other vote btn (e.g. if upvote, remove vote-clicked from downvote)
                if (voteType === "upVote") {
                    // get the up vote btn's corresponding down vote btn element 
                    var downVoteElement = element.parentElement.parentElement.childNodes[5].childNodes[0];

                    // change score counter for post
                    if (resp.data.isNewVoter) {
                        postScoreCounter.innerHTML = parseInt(postScoreCounter.innerHTML) + 1;
                    } else {
                        postScoreCounter.innerHTML = parseInt(postScoreCounter.innerHTML) + 2;
                    }


                    // if the corresponding down vote btn is already clicked (is orange) change color back to gray
                    downVoteElement.classList.remove('vote-clicked')


                } else {
                    // get the down vote btn's corresponding up vote btn element 
                    var upVoteElement = element.parentElement.parentElement.childNodes[1].childNodes[0];

                    // change score counter for post
                    if (resp.data.isNewVoter) {
                        postScoreCounter.innerHTML = parseInt(postScoreCounter.innerHTML) - 1;
                    } else {
                        postScoreCounter.innerHTML = parseInt(postScoreCounter.innerHTML) - 2;
                    }
                    // if the corresponding up vote btn is already clicked (is orange) change color back to gray
                    upVoteElement.classList.remove('vote-clicked')
                }
            } else {
                alert("Please login before voting on posts.");
            }
            $("i.vote-icon").attr("disabled", false);

        }).catch(err => {
            $("i.vote-icon").attr("disabled", false);
            console.log(err);
        });
    }
}

// retrive the posts in a certain order (depending on the selected 'Sort by' option)
function sortPosts(element, postsType) {
    var url = 'http://localhost:3000/posts/'
    if (postsType === 'all') {
        url += 'sortAllPosts'
    }
    else if (postsType === 'category') {
        url += 'sortCategoryPosts'
    }
    else if (postsType === 'subcategory') {
        url += 'sortSubcategoryPosts'
    }

    axios.get(url, {
        headers: {
            'sort-field': element.value,
            'sort-order': 'descending'
        }
    }).then(resp => {
        // set document's content to the response data (resp.data returns the updated html)
        document.body.innerHTML = resp.data
    }).catch(err => {
        console.log(err)
    })
}