// === Selectors === //
const body = document.querySelector('body');
const sidebar = body.querySelector('.sidebar');
const toggleSidebar = body.querySelector('.toggleS');
const searchBox = body.querySelector('.search-box');
const modeSwitch = body.querySelector('.toggle-switch');
const modeText = body.querySelector('.mode-text');

toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('closeSidebar');
});
modeSwitch.addEventListener('click', () => {
    body.classList.toggle('darkTheme');

    if (body.classList.contains('darkTheme')) {
        modeText.innerText = "Light Mode";
    } else {
        modeText.innerText = "Dark Mode";
    }
});



let myLibrary = [];

function Book() {
    // the constructor...
}

function addBookToLibrary() {
    // do stuff here
}