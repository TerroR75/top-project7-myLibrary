import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance } from 'firebase/performance';
import { getDoc } from 'firebase/firestore/lite';

// === Selectors === //
const body = document.querySelector('body');
const sidebar = body.querySelector('.sidebar');
const toggleSidebar = body.querySelector('.toggleS');
const searchBox = body.querySelector('.search-box');
const searchInput = body.querySelector('.search-input');
const modeSwitch = body.querySelector('.toggle-switch');
const modeText = body.querySelector('.mode-text');
const bookDisplay = body.querySelector('.book-display');
const bookFunctions = body.querySelector('.book-functions');
const authBtn = body.querySelector('.auth-btn');

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

// FIREBASE

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBNfcVeoBrZKzaO_SoibgOr_kPxGGopE7U',
  authDomain: 'top-terror75.firebaseapp.com',
  projectId: 'top-terror75',
  storageBucket: 'top-terror75.appspot.com',
  messagingSenderId: '910509408594',
  appId: '1:910509408594:web:e059c3fad55cf00d64fa8b',
  measurementId: 'G-GDSCQDHNSD',
});
const db = getFirestore(firebaseApp);

async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

authBtn.addEventListener('click', signIn);

// Theme preference
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
if (userPrefersDark) {
  body.classList.add('darkTheme');
} else {
  body.classList.remove('darkTheme');
}

toggleSidebar.addEventListener('click', () => {
  sidebar.classList.toggle('closeSidebar');
});
modeSwitch.addEventListener('click', () => {
  body.classList.toggle('darkTheme');

  if (body.classList.contains('darkTheme')) {
    modeText.innerText = 'Light Mode';
  } else {
    modeText.innerText = 'Dark Mode';
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

searchInput.addEventListener('input', () => {
  console.log('xd');
});

let myLibrary = [];
// SAVE & LOAD (local storage))
// loadData();

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
  // saveData()
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
  // Clean display
  bookDisplay.innerHTML = '';

  // Render books on the display
  appendBookElements();

  // Update styles
  updateStyles();

  // Add button events
  addBookFunctions();
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
    divBookAuthor.innerText = `By: ${book.author}`;

    let divBookPages = document.createElement('div');
    divBookPages.classList.add('book-pages');
    divBookPages.innerText = `Length: ${book.pages} pages`;

    let divBookPublishDate = document.createElement('div');
    divBookPublishDate.classList.add('book-publish-date');
    divBookPublishDate.innerText = `Publishment year: ${book.publishDate}`;

    // Book functions
    let btnRemoveBook = document.createElement('i');
    btnRemoveBook.classList.add('fa-solid', 'fa-xmark', 'btn-book-remove');
    btnRemoveBook.dataset.id = myLibrary.indexOf(book);
    // btnRemoveBook.addEventListener('click', () => {
    //     myLibrary.splice(myLibrary.indexOf(book), 1);
    //     refreshDisplay();
    // });

    let btnReadBook = document.createElement('i');
    btnReadBook.classList.add('fa-solid', 'fa-check', 'btn-book-finished');
    btnReadBook.dataset.id = myLibrary.indexOf(book);

    newBook.appendChild(divBookContent);
    divBookContent.appendChild(divBookInfo);
    divBookContent.appendChild(divBookFunctions);
    divBookInfo.appendChild(divBookTitle);
    divBookInfo.appendChild(divBookAuthor);
    divBookInfo.appendChild(divBookPages);
    divBookInfo.appendChild(divBookPublishDate);

    divBookFunctions.appendChild(btnReadBook);
    divBookFunctions.appendChild(btnRemoveBook);

    bookDisplay.appendChild(newBook);
  }
}

function addBookFunctions() {
  let removeBtns = document.getElementsByClassName('btn-book-remove');
  for (let btn of removeBtns) {
    btn.addEventListener('click', () => {
      let userInput = confirm('Are you sure?');
      if (userInput) {
        myLibrary.splice(parseInt(btn.dataset.id), 1);
        // saveData();
        refreshDisplay();
      }
    });
  }

  let readStatusBtns = document.getElementsByClassName('btn-book-finished');
  for (let btn of readStatusBtns) {
    btn.addEventListener('click', () => {
      if (myLibrary[btn.dataset.id].isRead) {
        myLibrary[btn.dataset.id].isRead = false;
      } else {
        myLibrary[btn.dataset.id].isRead = true;
      }
      // saveData();
      refreshDisplay();
    });
  }
}

function updateStyles() {
  let books = document.getElementsByClassName('book');
  for (let book of books) {
    console.log(book);
    if (myLibrary[book.dataset.id].isRead) {
      book.classList.add('isRead');
    } else {
      book.classList.remove('isRead');
    }
  }
}

function saveData() {
  let data = JSON.stringify(myLibrary);
  window.localStorage.setItem('data', data);
}

function loadData() {
  let data = window.localStorage.getItem('data');
  myLibrary = JSON.parse(data);
  refreshDisplay();
}
