var modalCredits = document.getElementById("modalCredits");
var modalControls = document.getElementById("modalControls");

// Get the button that opens the modal
var btnCredits = document.getElementById("btnCredits");
var btnControls = document.getElementById("btnControls");

// Get the <span> element that closes the modal
var span = document.querySelectorAll(".close");

for (var i = 0; i < span.length; i++) {
    span[i].addEventListener('click', function(event) {
        modalCredits.style.display = "none";
        modalControls.style.display = "none";
    });
}


// When the user clicks the button, open the modal
btnCredits.onclick = function() {
    modalCredits.style.display = "block";

}

btnControls.onclick = function() {
    modalControls.style.display = "block";

}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalCredits) {
        modalCredits.style.display = "none";
    }else if(event.target == modalControls) {
        modalControls.style.display = "none";
    }
}