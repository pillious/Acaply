var usernameElement = document.getElementById("username");
var passwordElement = document.getElementById("password");
var errorMsgElement = document.getElementById("login-error-msg");

// login on btn press
$("#submit-login").click(function () {
    login();
});

// login on enter key press
$('#username').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        login(); 
    }
});

$('#password').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        login();
    }
});

// attempt login
async function login() {
    const loginData = await axios.post("http://localhost:3000/loginValidate", {
        username: usernameElement.value,
        password: passwordElement.value
    });

    console.log(loginData)

    if (loginData.data.isLoggedIn) {
        window.location = "/";
    }
    else {
        console.log(loginData.data.errorMsg)
        errorMsgElement.style.display = "block";
        errorMsgElement.innerHTML = loginData.data.errorMsg;
    }

    usernameElement.value = "";
    passwordElement.value = "";
}