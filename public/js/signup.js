var usernameElement = document.getElementById("username");
var emailElement = document.getElementById("email");
var passwordElement = document.getElementById("password");
var errorMsgElement = document.getElementById("login-error-msg");

// signup on btn press
$("#submit-signup").click(function () {
    if (passwordElement.value != '' && usernameElement.value != '' && emailElement.value != '') {
        var isEmailValid = emailIsValid(emailElement.value);

        if (passwordElement.value != '' && usernameElement.value != '') {
            if (isEmailValid) {
                signup();
            }
            else {
                errorMsgElement.style.display = "block";
                errorMsgElement.innerHTML = "Invalid email.";
            }
        }
    } else {
        errorMsgElement.style.display = "block";
        errorMsgElement.innerHTML = "All fields are required.";
    }
});

// signup on enter key press
$('#username').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);

    if (keycode == '13' && passwordElement.value != '' && usernameElement.value != '') {
        var isEmailValid = emailIsValid(emailElement.value);

        if (isEmailValid) {
            signup();
        }
        else {
            errorMsgElement.style.display = "block";
            errorMsgElement.innerHTML = "Invalid email.";
        }
    }
});

$('#password').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);

    if (keycode == '13' && passwordElement.value != '' && usernameElement.value != '') {
        var isEmailValid = emailIsValid(emailElement.value);

        if (isEmailValid) {
            signup();
        }
        else {
            errorMsgElement.style.display = "block";
            errorMsgElement.innerHTML = "Invalid email.";
        }
    }

});

// returns true/false depending on if email is valid
function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// attempt to create new account
async function signup() {
    const signupData = await axios.post("http://localhost:3000/createAccount", {
        username: usernameElement.value,
        email: emailElement.value,
        password: passwordElement.value
    });

    if (signupData.data.isLoggedIn) {
        window.location = "/";
    } else {
        errorMsgElement.style.display = "block";

        // 11000 -> username/email not unique
        if (signupData.data.errorCode === 11000) {
            if (signupData.data.errorMsg.includes("username")) {
                errorMsgElement.innerHTML = "Sorry, this username is already taken.";
            }
            else if (signupData.data.errorMsg.includes("email")) {
                errorMsgElement.innerHTML = "Email already in use.";
            }
        } else {
            errorMsgElement.innerHTML = "An error occured while creating your account.";
            usernameElement.value = "";
            passwordElement.value = "";
        }

    }
}