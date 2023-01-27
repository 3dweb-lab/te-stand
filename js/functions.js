const password = "vrpe";

document.addEventListener('DOMContentLoaded', function() {
    const panel = document.getElementById("controlPanel");
    const toggleButton = document.getElementById("cameraClickableTag");

    toggleButton.addEventListener("click", function() {
        toggleButton.classList.toggle("open");
        panel.classList.toggle("open");
    });

    const loginPage = document.getElementById("loginPage");
    const inputPsw = document.getElementById("psw");
    const enterButton = document.getElementById("loginBtn");
    const body = document.getElementById("body");

    enterButton.addEventListener("click", function() {
        validateLogin();
    });

    inputPsw.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          validateLogin();
        }
      });

    function validateLogin() {
        if (inputPsw.value === password) {
            //alert("Login successful!");
            body.style.overflowY = "scroll";
            body.style.overflowX = "hidden";
            loginPage.style.display = "none";
        }
        else if (inputPsw.value == "") {
            //alert("Enter password!");
        } 
        else {
            alert("Login failed!");
        }
    }
});
