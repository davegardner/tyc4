/* close the menu if the user clicks outside it
*/
var menu = document.getElementById ('menu');
var hamburger = document.getElementById("hamburgerButton");

document.addEventListener('click', handleMenuClick);

function handleMenuClick(event) {
    if(hamburger.checked && event.target != hamburger && event.target != menu){
        hamburger.checked = false;
    }
}

