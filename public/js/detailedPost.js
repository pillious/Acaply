var commentBody = document.getElementById("commentBody");

//This function runs when a user tries to delete their post.
async function createNewComment(postId) {
    if (postId && commentBody.value) {
        var params = {
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

            var context = {
                body: commentBody.value
            };

            var newCommentHTML = compiledTemplate(context);
            console.log(newCommentHTML)
            $('#comments-wrapper').prepend(newCommentHTML);
        } else {
            console.log(response.data, response.status);
        }
    }
}

// allow comment to be editable
function enableCommentEdit(element) {
    var commentElement = element.parentNode.parentNode.parentNode.parentNode;

    // the element containing the content of the comment being edited
    var commentContentElement = commentElement.childNodes[3];

    // make this element editable by user
    commentContentElement.contentEditable = true;

    // show buttons to save/cancel edits
    var editBtnsWrapperElement = commentElement.childNodes[5];
    editBtnsWrapperElement.style.display = "block";
}

// disallow comment editing
function disableCommentEdit(element) {
    var commentElement = element.parentNode.parentNode;

    // the element containing the content of the comment being edited
    var commentContentElement = commentElement.childNodes[3];

    // make this element not editable by user
    commentContentElement.contentEditable = false;

    // hide buttons to save/cancel edits
    var editBtnsWrapperElement = commentElement.childNodes[5];
    editBtnsWrapperElement.style.display = "none";

    return commentContentElement;
}

// cancel the edits to comment
function editCommentCancel(element) {
    disableCommentEdit(element);
    location.reload();
}

async function editCommentSave(element, commentId) {
    // return val -> element containing the comment text
    var commentContentElement = disableCommentEdit(element);

    // check if comment text is empty & blank
    if ((commentContentElement.innerHTML != "") && (commentContentElement.innerHTML.replace(/\s/g,"") != "")) {
        var params = {
            // temp fix for edited comment formatting
            commentBody: commentContentElement.innerText,
            commentId: commentId
        };

        // save edited comment to db
        const response = await axios.post("http://localhost:3000/comment/editComment", {
            params
        });
        console.log(response)
    }
    else {
        location.reload();
    }
}

//This function runs when a user tries to delete their comment.
async function deleteComment(commentId) {
    var confirmDelete = confirm("Are you sure you want to delete this comment?");
    if (confirmDelete) {
        axios.delete("http://localhost:3000/comment/" + commentId).then(resp => {
            location.reload();
        }).catch(err => {
            console.log(err);
        })
    }
    // const response = await axios.delete("http://localhost:3000/comment/" + commentId);
}