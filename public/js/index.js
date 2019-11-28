function deletePost(postId) {
    var confirmDelete = confirm("Are you sure you want to delete this post?")
    if (confirmDelete) {
        axios.delete("http://localhost:3000/posts/" + postId).then(function (response) {
            location.reload();
        })
    }
}

// function editPost(postId) {
//     axios.post("http://localhost:3000/posts/editPost").then(function (response) {
//         console.log(response)
//     }).catch(function (err) {
//         console.log(err);
//     })

// }