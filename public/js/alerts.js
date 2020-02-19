const alertMsgElement = document.getElementById("alert-msg");
var alertElement = document.getElementsByClassName("alert-wrapper");

window.onload = function() {
    if (alertMsgElement.innerHTML != "") {
        alertElement.style.display = "inline";
    }
}