import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

let signUpUserName = document.getElementById('sign-up-user-first-name');
let signUpEmail = document.getElementById('sign-up-user-email');
let signUpPassword = document.getElementById('sign-up-user-password');
let signInEmail = document.getElementById('user-email');
let signInPassword = document.getElementById('user-password');
let signUpForm = document.getElementById('sign-up-form');
let signInForm = document.getElementById('sign-in-form');
let BlogAppContainer = document.getElementById('Blog-app-container');
let signInTxt = document.getElementById('sign-in-txt');
let signInDiv = document.getElementById('sign-in');
let signupDiv = document.getElementById('sign-up');
let signUpTxt = document.getElementById('sign-up-txt');
let container = document.getElementsByClassName('container');
let logoutBtn = document.getElementById('logoutBtn');

const firebaseConfig = {
    apiKey: "AIzaSyDMeG-Yt8eUI3eoSEbLokIk9Fo_fCRTZ3k",
    authDomain: "blog-app-9f834.firebaseapp.com",
    projectId: "blog-app-9f834",
    storageBucket: "blog-app-9f834.appspot.com",
    messagingSenderId: "114009764949",
    appId: "1:114009764949:web:3c7974840f125054e290dc",
    measurementId: "G-K5QB7B6K9N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db = getFirestore(app)

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        BlogAppContainer.style.display = 'block'
        container[0].style.display = 'none'

        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
        BlogAppContainer.style.display = 'none';
        container[0].style.display = 'flex';

    }
});

signUpForm.addEventListener('submit', a => {

    a.preventDefault()

    createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value, signUpUserName.value)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            BlogAppContainer.style.display = 'block'
            container[0].style.display = 'none'

            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('This email is already signed up')
            signUpPassword.value = '';
            BlogAppContainer.style.display = 'none'
            container[0].style.display = 'flex'

            signInEmail.value = '';
            signUpPassword.value = '';
            signInPassword.value = '';
            // ..
        });

})

signInForm.addEventListener('submit', a => {
    a.preventDefault()

    signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value, signUpUserName.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            BlogAppContainer.style.display = 'block'
            container[0].style.display = 'none'
            signUpPassword.value = '';
            signInPassword.value = '';

            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert('incorrect Email or Password')
            signInPassword.value = '';
        });


}
)

logoutBtn.addEventListener('click', function () {
    signOut(auth).then(() => {
        // Sign-out successful.

        BlogAppContainer.style.display = 'none'
        container[0].style.display = 'flex'
    }).catch((error) => {
        // An error happened.
        alert('Some error please try again')
    });
})

signUpTxt.addEventListener('click', () => {

    signInDiv.style.display = 'none'
    signupDiv.style.display = 'block'

})

signInTxt.addEventListener('click', () => {

    signInDiv.style.display = 'block'
    signupDiv.style.display = 'none'

})