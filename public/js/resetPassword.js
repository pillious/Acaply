$( "#submit-reset-password" ).click(function() {
    if ($('#password').val() == $('#confirmPassword').val()) {
        resetPassword();
    }
});

$('#password, #confirmPassword').on('keyup', function (event) {

    if ($('#password').val() == $('#confirmPassword').val()) {
        $('#match-message').css('display', 'none');

        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode == '13') {
            resetPassword();
        }
    } else {
        $('#match-message').css('display', 'block')
    }
});

async function resetPassword() {
    var newPassword = $('#password').val();

    const resetPasswordData = await axios.post("http://localhost:3000/resetPassword", {
        userId: $('#userId').val(),
        token: $('#token').val(),
        newPassword: newPassword
    });

    // if password change is successful
    if (resetPasswordData.data.passwordChanged) {
        $('#reset-password-card').hide();
        $('#success-card').show();
        $('#success-msg').html(resetPasswordData.data.message);
    }
    else {
       $('#reset-password-card').hide();
       $('#invalid-link-card').show();
       $('#error-msg').html(resetPasswordData.data.message);
    }
}

