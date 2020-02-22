// form validation for new posts
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                event.stopPropagation();
                if (form.checkValidity() === true) {
                    createPost();
                }
                form.classList.add('was-validated');

            }, false); 
        });
    }, false);
})();

// send post info to db
async function createPost() {
    const postData = await axios.post("http://localhost:3000/posts/createPost", {
        category: $( "#category" ).val(),
        subCategory: $( "#subCategory" ).val(),
        title: $( "#title" ).val(),
        body: $( "#body" ).val(),
        keywords: $( "#keywords" ).val()
    });

    if (postData.data.isLoggedIn) {
        if (postData.data.postCreated) {
            window.location = "http://localhost:3000/posts/view/" + postData.data.postId;
        }
        else {
            $( "#message" ).html(postData.data.message);
        }
    }
    else {
        window.location = "http://localhost:3000/login";
    }
}