// === Selectors === //
const body = document.querySelector('body');
const sidebar = body.querySelector('.sidebar');
const toggleSidebar = body.querySelector('.toggleS');
const searchBox = body.querySelector('.search-box');
const modeSwitch = body.querySelector('.toggle-switch');
const modeText = body.querySelector('.mode-text');
const bookDisplay = body.querySelector('.book-display');

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
    refreshDisplay();
}


function refreshDisplay() {
    // const display = document.getElementById('Library-container');
    // const books = document.querySelectorAll('.book');
    // books.forEach(book => display.removeChild(book));

    // for (let i = 0; i < myLibrary.length; i++) {
    //     createBook(myLibrary[i]);
    // }


    // for (let book in myLibrary) {
    //     let newBook = document.createElement('article');
    //     newBook.classList.add('book');

    //     let divBookContent = document.createElement('div');
    //     divBookContent.classList.add('book-content');

    //     let divBookInfo = document.createElement('div')
    //     divBookInfo.classList.add('book-information');

    //     // book info
    //     let divBookTitle = document.createElement('div');
    //     divBookTitle.classList.add('book-title');
    //     divBookTitle.innerText = book.title;

    //     let divBookAuthor = document.createElement('div');
    //     divBookAuthor.classList.add('book-author');
    //     divBookAuthor.innerText = book.author;

    //     let divBookPages = document.createElement('div');
    //     divBookPages.classList.add('book-pages');
    //     divBookPages.innerText = book.publishDate;

    //     let divBookPublishDate = document.createElement('div');
    //     divBookPublishDate.classList.add('book-publish-date');
    //     divBookPublishDate.innerText = inputDate.value;

    //     newBook.appendChild(divBookContent);
    //     divBookContent.appendChild(divBookInfo);
    //     divBookInfo.appendChild(divBookTitle);
    //     divBookInfo.appendChild(divBookAuthor);
    //     divBookInfo.appendChild(divBookPages);
    //     divBookInfo.appendChild(divBookPublishDate);

    //     bookDisplay.appendChild(newBook);
    // }
}

