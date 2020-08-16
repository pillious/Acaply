var commentBody = document.getElementById('commentBody');
var confirmMsgElement = document.getElementById('confirm-msg');
var confirmYesBtnElement = document.getElementById('confirm-yes-btn');

//This function runs when a user tries to delete their post.
function deletePost(postId) {
  const confirmMsg = 'Are you sure you want to delete this post?';
  setupModal(confirmMsg, postId, 'post');
  $('#confirm-modal').modal('show');
}

// change text & onclick function (when 'yes' presssed) of delete confirmation modal
function setupModal(confirmMsg, deleteItemId, deleteType) {
  confirmMsgElement.innerHTML = confirmMsg;
  if (deleteType === 'post') {
    confirmYesBtnElement.onclick = function () {
      deletePostFromDb(deleteItemId);
    };
  } else if (deleteType === 'comment') {
    confirmYesBtnElement.onclick = function () {
      deleteCommentFromDb(deleteItemId);
    };
  }
}

// remove the post from db
function deletePostFromDb(postId) {
  axios
    .delete('/posts/' + postId)
    .then((resp) => {
      window.location = '/posts/';
    })
    .catch((err) => {
      console.log(err);
    });
}

// remove the onclick added in setupModal()
$('#confirm-modal').on('hide.bs.modal', function (e) {
  $('#confirm-modal').off('click');
});

async function createNewComment(postId) {
  if (postId && commentBody.value) {
    var params = {
      comment: commentBody.value,
      postId: postId,
    };
    try {
      const response = await axios.post('/comment/createComment', {
        params,
      });

      if (response.status === 200) {
        location.reload();
      } else {
        console.log(response.data, response.status);
      }
    } catch (err) {
      console.log(err);
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
  editBtnsWrapperElement.style.display = 'block';
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
  editBtnsWrapperElement.style.display = 'none';

  return commentContentElement;
}

// cancel the edits to comment
function editCommentCancel(element) {
  disableCommentEdit(element);
  location.reload();
}

// save edits to comment
async function editCommentSave(element, commentId) {
  // return val -> element containing the comment text
  var commentContentElement = disableCommentEdit(element);

  // check if comment text is empty & blank
  if (
    commentContentElement.innerHTML != '' &&
    commentContentElement.innerHTML.replace(/\s/g, '') != ''
  ) {
    var params = {
      // temp fix for edited comment formatting
      commentBody: commentContentElement.innerText,
      commentId: commentId,
    };

    // save edited comment to db
    try {
      const response = await axios.post('/comment/editComment', {
        params,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  } else {
    location.reload();
  }
}

//This function runs when a user tries to delete their comment.
function deleteComment(commentId) {
  const confirmMsg = 'Are you sure you want to delete this comment?';
  setupModal(confirmMsg, commentId, 'comment');
  $('#confirm-modal').modal('show');
}

// remove comment from db
function deleteCommentFromDb(commentId) {
  axios
    .delete('/comment/' + commentId)
    .then((resp) => {
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}
