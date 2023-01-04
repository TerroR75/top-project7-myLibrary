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
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance } from 'firebase/performance';
import { v4 as uuidv4 } from 'uuid';
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
const signOutButtonElement = body.querySelector('#LOGOUT_BTN');
const signInButtonElement = body.querySelector('#LOGIN_BTN');

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

let myLibrary = [];
let currentUser;
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

function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}

async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

async function signOutUser() {
  myLibrary = [];
  deleteDataFromLocalStorage('all');
  // Sign out of Firebase
  await signOut(getAuth());
  refreshDisplay();
  console.log(myLibrary);
}

function isUserSignedIn() {
  // TODO 6: Return true if a user is signed-in.
  return !!getAuth().currentUser;
}

signInButtonElement.addEventListener('click', signIn);
signOutButtonElement.addEventListener('click', signOutUser);

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

// TODO: Implement searching query
searchInput.addEventListener('input', () => {
  console.log('xd');
});

function Book(book) {
  if (book == null) {
    this.title = inputTitle.value;
    this.author = inputAuthor.value;
    this.pages = inputPagesCount.value;
    this.publishDate = inputDate.value;
    this.isRead = false;
    this.uid = uuidv4();
  } else {
    this.title = book.title;
    this.author = book.author;
    this.pages = book.pages;
    this.publishDate = book.publishDate;
    this.isRead = book.isRead;
    this.uid = book.uid;
  }
}

async function addBookToLibrary() {
  modalBg.classList.remove('modal-active');
  modalForm.classList.remove('form-active');

  const newBook = new Book();
  myLibrary.push(newBook);

  await saveDataToFirebase(newBook);
  saveToLocalStorage('library', myLibrary);
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
        removeDocFromFirebase(currentUser.uid, myLibrary[parseInt(btn.dataset.id)].uid);
        myLibrary.splice(parseInt(btn.dataset.id), 1);
        saveToLocalStorage('library', myLibrary);
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

async function saveDataToFirebase(newBook) {
  try {
    await setDoc(doc(getFirestore(), `${currentUser.uid}`, `${newBook.uid}`), {
      title: newBook.title,
      author: newBook.author,
      pages: newBook.pages,
      publishDate: newBook.publishDate,
      isRead: newBook.isRead,
      uid: newBook.uid,
      name: getUserName(),
    });
  } catch (error) {
    console.error('Error writing data to Firebase Database', error);
  }
}

async function loadDataFromFirebase() {
  console.log('Loading data...');

  const querySnapshot = await getDocs(collection(db, currentUser.uid));
  querySnapshot.forEach((doc) => {
    const retrievedBook = doc.data();
    const book = new Book(retrievedBook);
    myLibrary.push(book);
  });
  console.log('Retrieved data from ' + '%cfirebase', 'color: green');

  saveToLocalStorage('library', myLibrary);

  refreshDisplay();
}

async function removeDocFromFirebase(currentUserID, bookID) {
  console.log('Removing book from firebase...');
  console.log(`User id: ${currentUserID}`);
  console.log(`Book id: ${bookID}`);
  await deleteDoc(doc(getFirestore(), currentUserID, bookID));
}

function getProfilePicUrl() {
  // TODO 4: Return the user's profile pic URL.
  return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}

function getUserName() {
  // TODO 5: Return the user's display name.
  return getAuth().currentUser.displayName;
}

// LOCAL STORAGE MODIFICATION FUNCTIONS
function saveToLocalStorage(key, data) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(key, dataJSON);
}

function retrieveDataFromLocalStorage(key) {
  const retrievedData = JSON.parse(localStorage.getItem(key));
  console.log(retrievedData);
  console.log('Retrieved data from ' + '%clocal storage', 'color: green');
  return retrievedData;
}

function deleteDataFromLocalStorage(key) {
  console.log(`localStorage BEFORE: ${localStorage}`);
  if (key === 'all') {
    console.log('...Removing ' + '%cwhole' + 'localStorage...', 'color: red');
    localStorage.clear();
  } else {
    console.log('...Removing ' + `%ckey: ${key} ` + 'in localStorage...', 'color: red');
    localStorage.removeItem(key);
  }
  console.log(`localStorage AFTER: ${localStorage}`);
}

async function authStateObserver(user) {
  if (user) {
    console.log('LOGGED IN');
    currentUser = user;

    // Check if myLibrary variable is empty, if so, check if local storage contains cached data to reduce
    // firebase retrieving stress
    if (myLibrary.length === 0) {
      if (myLibrary.length <= 0) {
        if (localStorage.getItem('library')) {
          myLibrary = retrieveDataFromLocalStorage('library');
          refreshDisplay();
        } else {
          await loadDataFromFirebase();
        }
      }
    }

    // User is signed in!
    // Get the signed-in user's profile pic and name.
    // var profilePicUrl = getProfilePicUrl();
    // var userName = getUserName();

    // Set the user's profile pic and name.
    // userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    // userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    // userNameElement.removeAttribute('hidden');
    // userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    // saveMessagingDeviceToken();
  } else {
    console.log('LOGGED OUT!');
    currentUser = null;
    console.log(currentUser);
    // User is signed out!
    // Hide user's profile and sign-out button.
    // userNameElement.setAttribute('hidden', 'true');
    // userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

initFirebaseAuth();
