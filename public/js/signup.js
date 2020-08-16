var usernameElement = document.getElementById('username');
var emailElement = document.getElementById('email');
var passwordElement = document.getElementById('password');
var errorMsgElement = document.getElementById('login-error-msg');

// signup on btn press
$('#submit-signup').click(function () {
  validateSignup();
});

// signup on enter key press
$('#username, #password, #email').keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == '13') {
    validateSignup();
  }
});

function validateSignup() {
  if (
    passwordElement.value != '' &&
    usernameElement.value != '' &&
    emailElement.value != ''
  ) {
    var isEmailValid = emailIsValid(emailElement.value);

    if (passwordElement.value != '' && usernameElement.value != '') {
      if (isEmailValid) {
        // username must be alphanumeric
        if (/^[0-9a-zA-Z]+$/.test(usernameElement.value)) {
          signup();
        } else {
          errorMsgElement.style.display = 'block';
          errorMsgElement.innerHTML =
            'Usernames must consist of only numbers and letters.';
        }
      } else {
        errorMsgElement.style.display = 'block';
        errorMsgElement.innerHTML = 'Invalid email.';
      }
    }
  } else {
    errorMsgElement.style.display = 'block';
    errorMsgElement.innerHTML = 'All fields are required.';
  }
}

// returns true/false depending on if email is valid
function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// attempt to create new account
async function signup() {
  const signupData = await axios.post('/createAccount', {
    username: usernameElement.value,
    email: emailElement.value,
    password: passwordElement.value,
  });

  if (signupData.data.isLoggedIn) {
    window.location = '/';
  } else {
    errorMsgElement.style.display = 'block';

    // 11000 -> username/email not unique
    if (signupData.data.errorCode === 11000) {
      if (signupData.data.errorMsg.includes('username')) {
        errorMsgElement.innerHTML = 'Sorry, this username is already taken.';
      } else if (signupData.data.errorMsg.includes('email')) {
        errorMsgElement.innerHTML = 'Email already in use.';
      }
    } else {
      errorMsgElement.innerHTML =
        'An error occured while creating your account.';
      usernameElement.value = '';
      passwordElement.value = '';
    }
  }
}
