var usernameElement = document.getElementById('username');
var passwordElement = document.getElementById('password');
var errorMsgElement = document.getElementById('login-error-msg');

// login on btn press
$('#submit-login').click(function () {
  if (passwordElement.value != '' && usernameElement.value != '') {
    login();
  } else {
    errorMsgElement.style.display = 'block';
    errorMsgElement.innerHTML = 'Please enter your username and password.';
  }
});

// login on enter key press
$('#username').keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (
    keycode == '13' &&
    passwordElement.value != '' &&
    usernameElement.value != ''
  ) {
    login();
  }
});

$('#password').keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (
    keycode == '13' &&
    passwordElement.value != '' &&
    usernameElement.value != ''
  ) {
    login();
  }
});

// attempt login
async function login() {
  const loginData = await axios.post('/loginValidate', {
    username: usernameElement.value,
    password: passwordElement.value,
  });

  if (loginData.data.isLoggedIn) {
    window.location = '/';
  } else {
    errorMsgElement.style.display = 'block';
    errorMsgElement.innerHTML = loginData.data.errorMsg;
  }

  usernameElement.value = '';
  passwordElement.value = '';
}
