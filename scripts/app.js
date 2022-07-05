// === Selectors === //
const body = document.querySelector('body');
const sidebar = body.querySelector('.sidebar');
const toggleSidebar = body.querySelector('.toggleS');
const searchBox = body.querySelector('.search-box');
const modeSwitch = body.querySelector('.toggle-switch');
const modeText = body.querySelector('.mode-text');
const bookDisplay = body.querySelector('.book-display');
const bookFunctions = body.querySelector('.book-functions');
// const btnBookRemove = bookFunctions.querySelector('.btn-book-remove');

// == Modal related == //
const btnAddBook = body.querySelector('.btn-add-book');
const modalBg = body.querySelector('.modal-bg');
const btnModalClose = body.querySelector('.modal-close');
const modalForm = body.querySelector('.modal');
const btnSubmit = body.querySelector('.submit-button');

// = Modal values = //
const inputTitle = body.querySelector('#title'),
    inputAuthor = body.querySelector('#author'),
    inputPagesCount = body.querySelector('#pagesCount'),
    inputDate = body.querySelector('#publishmentDate');




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

btnAddBook.addEventListener('click', () => {
    modalBg.classList.toggle('modal-active');
    modalForm.classList.toggle('form-active');
});
btnModalClose.addEventListener('click', () => {
    modalBg.classList.remove('modal-active');
    modalForm.classList.remove('form-active');
});

btnSubmit.addEventListener('click', addBookToLibrary);

let myLibrary = [];


function Book() {
    this.title = inputTitle.value;
    this.author = inputAuthor.value;
    this.pages = inputPagesCount.value;
    this.publishDate = inputDate.value;
    this.isRead = false;
}

function addBookToLibrary() {
    modalBg.classList.remove('modal-active');
    modalForm.classList.remove('form-active');

    newBook = new Book();
    myLibrary.push(newBook);
    clearModalForm();
    refreshDisplay();
}

function clearModalForm() {
    inputTitle.value = '';
    inputAuthor.value = '';
    inputPagesCount.value = '';
    inputDate.value = '';
}

function refreshDisplay() {
    // Clean displan
    bookDisplay.innerHTML = "";

    // Render books on the display
    appendBookElements();
}

function appendBookElements() {
    for (let book of myLibrary) {
        let newBook = document.createElement('article');
        newBook.classList.add('book');
        newBook.dataset.id = myLibrary.indexOf(book);

        let divBookContent = document.createElement('div');
        divBookContent.classList.add('book-content');

        let divBookInfo = document.createElement('div');
        divBookInfo.classList.add('book-information');

        let divBookFunctions = document.createElement('div');
        divBookFunctions.classList.add('book-functions');

        // book info
        let divBookTitle = document.createElement('div');
        divBookTitle.classList.add('book-title');
        divBookTitle.innerText = book.title;

        let divBookAuthor = document.createElement('div');
        divBookAuthor.classList.add('book-author');
        divBookAuthor.innerText = book.author;

        let divBookPages = document.createElement('div');
        divBookPages.classList.add('book-pages');
        divBookPages.innerText = book.pages;

        let divBookPublishDate = document.createElement('div');
        divBookPublishDate.classList.add('book-publish-date');
        divBookPublishDate.innerText = inputDate.value;

        // Book functions
        let btnRemoveBook = document.createElement('i');
        btnRemoveBook.setAttribute('id', 'btn-book-remove')
        btnRemoveBook.classList.add('fa-solid');
        btnRemoveBook.classList.add('fa-xmark');
        btnRemoveBook.addEventListener('click', () => {
            myLibrary.splice(myLibrary.indexOf(book), 1);
            refreshDisplay();
        });

        newBook.appendChild(divBookContent);
        divBookContent.appendChild(divBookInfo);
        divBookContent.appendChild(divBookFunctions);
        divBookInfo.appendChild(divBookTitle);
        divBookInfo.appendChild(divBookAuthor);
        divBookInfo.appendChild(divBookPages);
        divBookInfo.appendChild(divBookPublishDate);
        divBookFunctions.appendChild(btnRemoveBook);

        bookDisplay.appendChild(newBook);


    }
}

function removeBookFunction() {

}

