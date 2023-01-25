document.addEventListener('DOMContentLoaded', function() {
    const panel = document.getElementById("controlPanel");
    const toggleButton = document.getElementById("cameraClickableTag");

    toggleButton.addEventListener("click", function() {
        toggleButton.classList.toggle("open");
        panel.classList.toggle("open");
    });
});
