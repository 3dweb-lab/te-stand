const password = "vrpe";

document.addEventListener('DOMContentLoaded', function() {

    /// LOIGIN
    const body = document.getElementById("body");
    const lockedSection = document.getElementById("lockedSection");
    const loginPage = document.getElementById("loginPage");
    const inputPsw = document.getElementById("psw");
    const enterButton = document.getElementById("loginBtn");

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
            // content3D.style.visibility = "visible";
            // mainPageBlock.visibility = "visible";
            // footer.style.visibility = "visible";

            // for (var i; i<mainPageBlock.length; i++){
            //     mainPageBlock[i].visibility = "visible";
            // }
            // for (var i; i<pageBlock.length; i++){
            //     pageBlock[i].visibility = "visible";
            // }
            lockedSection.style.visibility = "visible";
            body.style.overflowY = "scroll";
            body.style.overflowX = "hidden";
            loginPage.style.display = "none";
        }
        else if (inputPsw.value == "") {
            alert("Enter password!");
        } 
        else {
            alert("Login failed!");
        }
    }

    /// CONTROL PANEL
    const panel = document.getElementById("controlPanel");
    const toggleButton = document.getElementById("cameraClickableTag");

    toggleButton.addEventListener("click", function() {
        toggleButton.classList.toggle("open");
        panel.classList.toggle("open");
    });

    /// NAV BAR
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navBar = document.querySelector(".navBar");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        navBar.classList.toggle("active");
    });

    document.querySelectorAll(".nav-item").forEach(n => n. 
        addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            navBar.classList.remove("active");
    }))

    // SCROLL-UP
    const upArrowBtn = document.querySelector("#up-arrowClickableTag");
    const upArrow = document.querySelector("#up-arrow");

    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            upArrowBtn.style.display = "block";
            upArrow.style.display = "block";
        } else {
            upArrowBtn.style.display = "none";
            upArrow.style.display = "none";
        }
      }

    upArrowBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
        });
    });
});
