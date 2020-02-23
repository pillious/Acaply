var emailElement = document.getElementById("email");
var msgElement = document.getElementById("error-msg");

$( "#submit-email" ).click(function() {
    var isEmailValid = emailIsValid(emailElement.value);

    if (isEmailValid) {
        sendEmail();
    }
    else {
        msgElement.style.display = "block";
        msgElement.innerHTML = "Invalid email.";
    }
});

$('#email').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);

    if (keycode == '13') {
        var isEmailValid = emailIsValid(emailElement.value);

        if (isEmailValid) {
            sendEmail();
        }
        else {
            msgElement.style.display = "block";
            msgElement.innerHTML = "Invalid email.";
        }
    }

});

// returns true/false depending on if email is valid
function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// send password reset email
async function sendEmail() {
    const emailData = await axios.post("/sendResetEmail", {
        email: emailElement.value
    });

    msgElement.style.display = "block";
    msgElement.innerHTML = emailData.data.message;
    if (emailData.data.success) {
        msgElement.classList.remove("text-danger");
        msgElement.classList.add("text-success");
        $( "#email, #submit-email" ).prop( "disabled", true );
    }
    else {
        msgElement.classList.remove("text-success");
        msgElement.classList.add("text-danger");
    }

    emailElement.value = "";
}