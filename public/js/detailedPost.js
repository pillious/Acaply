var commentBody = document.getElementById("commentBody");

//This function runs when a user tries to delete their post.
async function createNewComment(postId) {
    if (postId && commentBody.value) {
        params = {
            comment: commentBody.value,
            postId: postId
        };
        const response = await axios.post("http://localhost:3000/comment/createComment", {
            params
        });

        if (response.status === 200) {
            console.log(response.data, response.status);
            // add the new comment to UI (using HandlebarsJs)
            var template = $('#handlebars-new-comment').html();
            var compiledTemplate = Handlebars.compile(template);

            var params = {
                body: commentBody.value
            };

            var newCommentHTML = compiledTemplate(params);
            console.log(newCommentHTML)
            $('#comments-wrapper').prepend(newCommentHTML);
        }
        else {
            console.log(response.data, response.status);
        }
    }
}