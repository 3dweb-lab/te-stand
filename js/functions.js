const password = "vrpe";

document.addEventListener('DOMContentLoaded', function() {
    const panel = document.getElementById("controlPanel");
    const toggleButton = document.getElementById("cameraClickableTag");

    toggleButton.addEventListener("click", function() {
        toggleButton.classList.toggle("open");
        panel.classList.toggle("open");
    });

    const body = document.getElementById("body");
    const content3D = document.getElementById("content3D");
    const mainPageBlock = document.getElementsByClassName("mainPageBlock");
    const pageBlock = document.getElementsByClassName("pageBlock");
    const footer = document.getElementById("footer");


    const loginPage = document.getElementById("loginPage");
    const inputPsw = document.getElementById("psw");
    const enterButton = document.getElementById("loginBtn");

    content3D.style.visibility = "hidden";
    footer.style.visibility = "hidden";

    for (var i; i<mainPageBlock.length; i++){
        mainPageBlock[i].visibility = "hidden";
    }
    for (var i; i<pageBlock.length; i++){
        pageBlock[i].visibility = "hidden";
    }

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
            //titelBlock.style.visibility = "visible";
            content3D.style.visibility = "visible";
            mainPageBlock.visibility = "visible";
            footer.style.visibility = "visible";

            for (var i; i<mainPageBlock.length; i++){
                mainPageBlock[i].visibility = "visible";
            }
            for (var i; i<pageBlock.length; i++){
                pageBlock[i].visibility = "visible";
            }

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
