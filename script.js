import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, setDoc, getDoc, getDocs, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

let signUpUserName = document.getElementById('sign-up-user-first-name');
let signUpUserLastName = document.getElementById('sign-up-user-last-name');
let signUpEmail = document.getElementById('sign-up-user-email');
let signUpPassword = document.getElementById('sign-up-user-password');
let signUpRepeatPassword = document.getElementById('sign-up-user-repeat-password');
let signInEmail = document.getElementById('user-email');
let signInPassword = document.getElementById('user-password');
let signUpForm = document.getElementById('sign-up-form');
let signInForm = document.getElementById('sign-in-form');
let BlogAppContainer = document.getElementById('Blog-app-container');
let signInDiv = document.getElementById('sign-in');
let signupDiv = document.getElementById('sign-up');
let container = document.getElementsByClassName('container');
let loader = document.getElementById('loader');
let nextWhichThing = document.getElementsByClassName('nextWhichThing');
let whichThing = document.getElementById('whichThing');
let userNameHtml = document.getElementById('userName');
let blogForm = document.getElementById('blog-form');
let divForBlogAdd = document.getElementById('divForBlogAdd');
let myallBlogs = document.getElementById('myallBlogs');
let inputs = document.getElementsByClassName('input');
let PersonalBloggingAppTxt = document.getElementsByClassName('Personal-Blogging-App-txt');
let userPlaceholder = document.getElementById('userPlaceholder');
let userMindTxt = document.getElementById('userMindTxt');
let blogcontainer = document.getElementById('blogcontainer');
let profileContainer = document.getElementById('profile-container');

PersonalBloggingAppTxt[0].addEventListener('click', () => {
    window.location.reload()
})

userNameHtml.addEventListener('click',profilePage)

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
let storage = getStorage(app)
const storageRef = ref(storage,'usersImages/img');
let userId = '';
let userName = "";
let userImgUrl = '';
let blogId = '';
var edit = false;
var add = true;

nextWhichThing[0].addEventListener('click', checkPage)

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        BlogAppContainer.style.display = 'block'
        container[0].style.display = 'none'
        loader.style.display = 'none';
        userId = user.uid;
        checkPage()
        getBlogs()
        let userNameObj = await getDoc(doc(db, 'userName', userId))
        let { firstname, lastname } = userNameObj.data()
        userName = `${firstname} ${lastname}`
        userNameHtml.innerText = userName;
        myallBlogs.innerText = 'My Blogs';
        // ...
    } else {
        // User is signed out
        // ...
        myallBlogs.innerText = 'All Blogs';
        BlogAppContainer.style.display = 'none';
        container[0].style.display = 'flex';
        loader.style.display = 'none';
        checkPage()

    }
});

function checkPage() {
    if (BlogAppContainer.style.display == 'none' && signInDiv.style.display == 'none' && signupDiv.style.display == 'block') {
        nextWhichThing[0].innerText = 'Sign up'
        whichThing.innerText = 'Login'
        signInDiv.style.display = 'block'
        signupDiv.style.display = 'none'
    } else {
        whichThing.innerText = 'Sign up'
        nextWhichThing[0].innerText = 'Login'
        signInDiv.style.display = 'none'
        signupDiv.style.display = 'block'
    }
    if (BlogAppContainer.style.display == 'block' && !profileContainer.style.display) {
        whichThing.innerText = 'Dashboard'
        nextWhichThing[0].innerText = 'Logout'
        nextWhichThing[0].id = 'logoutBtn'
        let logoutBtn = document.getElementById('logoutBtn')

        logoutBtn?.addEventListener('click', logoutFunc)

        function logoutFunc() {

            signOut(auth).then(() => {
                // Sign-out successful.

                BlogAppContainer.style.display = 'none'
                container[0].style.display = 'flex'
                userNameHtml.innerText = '';
                checkPage()

            }).catch((error) => {
                // An error happened.
                alert('Some error please try again')
            });
        }
    }else if(profileContainer.style.display == 'block'){
        whichThing.innerText = 'Profile'
        nextWhichThing[0].innerText = 'Logout'
        nextWhichThing[0].id = 'logoutBtn'
        let logoutBtn = document.getElementById('logoutBtn')

        logoutBtn?.addEventListener('click', logoutFunc)

        function logoutFunc() {

            signOut(auth).then(() => {
                // Sign-out successful.

                BlogAppContainer.style.display = 'none'
                profileContainer.style.display = 'none'
                container[0].style.display = 'flex'
                userNameHtml.innerText = '';
                checkPage()

            }).catch((error) => {
                // An error happened.
                alert('Some error please try again')
            });
        }
    }

}

signInPassword.addEventListener('focus', () => {
    signInPassword.style.borderColor = 'rgb(98, 94, 94)';
    signInPassword.style.boxShadow = 'none';
})

signUpRepeatPassword.addEventListener('focus', () => {
    signUpRepeatPassword.style.borderColor = 'rgb(98, 94, 94)';
    signUpRepeatPassword.style.boxShadow = 'none';

})

signUpForm.addEventListener('submit', a => {

    a.preventDefault()

    if (signUpPassword.value == signUpRepeatPassword.value) {

        createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value)
            .then(async (userCredential) => {
                // Signed up 
                userId = userCredential.user.uid;
                BlogAppContainer.style.display = 'block'
                container[0].style.display = 'none'
                await setDoc(doc(db, 'userName', userId), {
                    firstname: signUpUserName.value,
                    lastname: signUpUserLastName.value
                })
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = ''
                }
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert('This email is already signed up')

                BlogAppContainer.style.display = 'none'
                container[0].style.display = 'flex'

                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = ''
                }
                // ..
            });
    } else {
        signUpRepeatPassword.style.borderColor = 'red';
        signUpRepeatPassword.style.boxShadow = '0px 0px 5px red';
        signUpRepeatPassword.value = '';
    }

})

signInForm.addEventListener('submit', a => {
    a.preventDefault()

    signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value, signUpUserName.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            BlogAppContainer.style.display = 'block'
            container[0].style.display = 'none'
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = ''
            }

            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            signInPassword.value = '';
            signInPassword.style.borderColor = 'red';
            signInPassword.style.boxShadow = '0px 0px 5px red';
        });


}
)

blogForm.addEventListener('submit', async (submitedForm) => {
    submitedForm.preventDefault()

    if (edit == false && add == true) {

        let now = new Date()
        let date = now.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })

        let obj = {
            placeholder: submitedForm.target[0].value,
            userMind: submitedForm.target[1].value,
            userName: userName,
            userImg: userImgUrl,
            engdate: date,
            userId: userId
        }

        let collectionRef = collection(db, 'userBlog')

        await addDoc(collectionRef, obj)

        getBlogs()

        submitedForm.target[0].value = '';
        submitedForm.target[1].value = '';
    } else {

        let obj = {
            placeholder: submitedForm.target[0].value,
            userMind: submitedForm.target[1].value,
        }

        let docRef = doc(db, 'userBlog', blogId)

        await updateDoc(docRef, obj)

        getBlogs()

        submitedForm.target[0].value = '';
        submitedForm.target[1].value = '';
        edit = false 
         add = true
    }

})

async function getBlogs() {
    divForBlogAdd.innerHTML = null;

    let collectionRef = collection(db, 'userBlog')

    let blogs = await getDocs(collectionRef)

    let q =  query(collectionRef,where("userId","==",userId))
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(element => {

        let { placeholder, userName, userImg, userMind, engdate } = element.data()
        let div = `
        <div class="blogCart">
        <div class="txtImgDiv">
        <img class="cartImg" src="${userImg}" alt="user image">
        <div>
        <span class="placeholdertxt">${placeholder}</span>
        <span class="txt"><span class="blogAdderName">${userName}</span> - <span class="blogAddedDate">${engdate}</span></span>
        </div>
        </div>
        <br>
        <span class="userMindTxt">${userMind}</span>
        <br>
        <span id="${element.id}" class="deleteTxt ${element.id}">Delete</span>
        <span id="${element.id}" class="editTxt ${element.id}">Edit</span>
        </div>`

        divForBlogAdd.innerHTML += div;
    });
}

setInterval(() => {
    let deleteTxt = document.getElementsByClassName('deleteTxt');

    for (let i = 0; i < deleteTxt.length; i++) {
        deleteTxt[i].addEventListener('click', deleteBlog)
    }
}, 1000);

async function deleteBlog() {
    console.log(this.id)
    await deleteDoc(doc(db, 'userBlog', this.id))
    getBlogs()
}

setInterval(() => {
    let editTxt = document.getElementsByClassName('editTxt');

    for (let i = 0; i < editTxt.length; i++) {
        editTxt[i].addEventListener('click', editBlog)
    }
}, 1000);

async function editBlog() {
    edit = true;
    add = false;
    blogId = this.id;

    let userBlog = await getDoc(doc(db, 'userBlog', this.id))

    userPlaceholder.value = userBlog.data().placeholder
    userMindTxt.value = userBlog.data().userMind
}

function profilePage (){
    if(!profileContainer.style.display){
    blogcontainer.style.display = 'none'
    profileContainer.style.display = 'block'
    checkPage()
    }else;
}

let imageInput = document.getElementById('imageInput');
let selectedImage= document.getElementById('selectedImage');
let updateBtn = document.getElementById('updateBtn');
let userNameForEdit = document.getElementById('userNameForEdit');
let userEmailForEdit = document.getElementById('userEmailForEdit');

updateBtn.addEventListener('click', profileEdit)

async function profileEdit () {
    await uploadBytes(storageRef,imageInput.value).then(() => {
        console.log('file is uploaded succesfully')
        getDownloadURL(storageRef).then(async (url) => {
            // let obj = {
            //     userImg : url 
            // }
            // await updateDoc(doc(db,'userBlog',blogId),obj)
            selectedImage.src = url;
            console.log(url)
        })
    })
    
    
}