var usernameElement = document.getElementById("username");
var passwordElement = document.getElementById("password");
var errorMsgElement = document.getElementById("login-error-msg");

// signup on btn press
$("#submit-signup").click(function () {
    if (passwordElement.value != '' && usernameElement.value != '') {
        signup();
    }
});

// signup on enter key press
$('#username').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13' && passwordElement.value != '' && usernameElement.value != ''){
        signup(); 
    }
});

$('#password').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13' && passwordElement.value != '' && usernameElement.value != ''){
        signup();
    }
});

// attempt to create new account
async function signup() {
    const signupData = await axios.post("http://localhost:3000/createAccount", {
        username: usernameElement.value,
        password: passwordElement.value
    });

    if (signupData.data.isLoggedIn) {
        window.location = "/";
    }
    else {
        errorMsgElement.style.display = "block";
        // 11000 -> username not unique
        if (signupData.data.errorCode === 11000) {
            errorMsgElement.innerHTML = "Sorry, this username is already taken.";
        }
        else {
            errorMsgElement.innerHTML = "An error occured while creating your account.";
            usernameElement.value = "";
            passwordElement.value = "";
        }

    }
}