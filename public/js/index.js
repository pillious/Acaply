//This function runs when a user tries to delete their post.
function deletePost(postId) {
    var confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        axios.delete("http://localhost:3000/posts/" + postId).then(function (response) {
            location.reload();
        })
    }
}

//This function runs when a user tries to delete their comment.
function deleteComment(commentId) {
    var confirmDelete = confirm("Are you sure you want to delete this comment?");
    if (confirmDelete) {
        axios.delete("http://localhost:3000/comment/" + commentId).then(function (response) {
            location.reload();
        })
    }
}