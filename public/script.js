import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

let signUpUserName = document.getElementById("sign-up-user-first-name");
let signUpUserLastName = document.getElementById("sign-up-user-last-name");
let signUpEmail = document.getElementById("sign-up-user-email");
let signUpPassword = document.getElementById("sign-up-user-password");
let signUpRepeatPassword = document.getElementById("sign-up-user-repeat-password");
let signInEmail = document.getElementById("user-email");
let signInPassword = document.getElementById("user-password");
let signUpForm = document.getElementById("sign-up-form");
let signInForm = document.getElementById("sign-in-form");
let BlogAppContainer = document.getElementById("Blog-app-container");
let signInDiv = document.getElementById("sign-in");
let signupDiv = document.getElementById("sign-up");
let container = document.getElementsByClassName("container");
let loader = document.getElementById("loader");
let nextWhichThing = document.getElementsByClassName("nextWhichThing");
let whichThing = document.getElementById("whichThing");
let userNameHtml = document.getElementById("userName");
let blogForm = document.getElementById("blog-form");
let divForBlogAdd = document.getElementById("divForBlogAdd");
let myallBlogs = document.getElementById("myallBlogs");
let inputs = document.getElementsByClassName("input");
let PersonalBloggingAppTxt = document.getElementsByClassName("Personal-Blogging-App-txt");
let userPlaceholder = document.getElementById("userPlaceholder");
let userMindTxt = document.getElementById("userMindTxt");
let blogcontainer = document.getElementById("blogcontainer");
let profileContainer = document.getElementById("profile-container");
let imageInput = document.getElementById("imageInput");
let selectedImage = document.getElementById("selectedImage");
let updateBtn = document.getElementById("updateBtn");
let userFirtsNameForEdit = document.getElementById("userFirtsNameForEdit");
let userLastNameForEdit = document.getElementById("userLastNameForEdit");
let userEmailForEdit = document.getElementById("userEmailForEdit");
let user_image = document.getElementById("user_image");
let submitBtn = document.getElementById('submitBtn');

PersonalBloggingAppTxt[0].addEventListener("click", () => {
  window.location.reload();
});

userNameHtml.addEventListener("click", profilePage);

const firebaseConfig = {
  apiKey: "AIzaSyDMeG-Yt8eUI3eoSEbLokIk9Fo_fCRTZ3k",
  authDomain: "blog-app-9f834.firebaseapp.com",
  projectId: "blog-app-9f834",
  storageBucket: "blog-app-9f834.appspot.com",
  messagingSenderId: "114009764949",
  appId: "1:114009764949:web:3c7974840f125054e290dc",
  measurementId: "G-K5QB7B6K9N",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db = getFirestore(app);
let storage = getStorage(app);
let collectionRef = collection(db, "userBlog");
let userId = "";
let userName = "";
let blogId = "";
var edit = false;
var add = true;
let anotherUserImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ69yukxQGBGUPT4o9Y7_v4nNsmgT5FuXbAQQ&usqp=CAU";

nextWhichThing[0].addEventListener("click", checkPage);
updateBtn.addEventListener("click", profileEdit);
imageInput.addEventListener("change", addImg);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    BlogAppContainer.style.display = "block";
    container[0].style.display = "none";
    loader.style.display = "none";
    userId = user.uid;
    checkPage();
    profileByDefault();
    getBlogs();

    let userNameObj = await getDoc(doc(db, "userName", userId));

    let { firstname, lastname, userImg } = userNameObj.data();
    userName = `${firstname} ${lastname}`;
    userNameHtml.innerText = userName;
    user_image.style.display = "block";
    user_image.src = userImg ? userImg : anotherUserImage;
    myallBlogs.innerText = "My Blogs";
    // ...
  } else {
    // User is signed out
    // ...
    myallBlogs.innerText = "All Blogs";
    BlogAppContainer.style.display = "none";
    container[0].style.display = "flex";
    loader.style.display = "none";
    checkPage();
  }
});

function checkPage() {
  if (
    BlogAppContainer.style.display == "none" &&
    signInDiv.style.display == "none" &&
    signupDiv.style.display == "block"
  ) {
    nextWhichThing[0].innerText = "Sign up";
    whichThing.innerText = "Login";
    signInDiv.style.display = "block";
    signupDiv.style.display = "none";
  } else {
    whichThing.innerText = "Sign up";
    nextWhichThing[0].innerText = "Login";
    signInDiv.style.display = "none";
    signupDiv.style.display = "block";
  }
  if (
    BlogAppContainer.style.display == "block" &&
    !profileContainer.style.display
  ) {
    whichThing.innerText = "Dashboard";
    nextWhichThing[0].innerText = "Logout";
    nextWhichThing[0].id = "logoutBtn";
    let logoutBtn = document.getElementById("logoutBtn");

    logoutBtn?.addEventListener("click", logoutFunc);

    function logoutFunc() {
      signOut(auth)
        .then(() => {
          // Sign-out successful.

          BlogAppContainer.style.display = "none";
          container[0].style.display = "flex";
          userNameHtml.innerText = "";
          user_image.src = "";
          user_image.style.display = "none";
          userPlaceholder.value = "";
          userMindTxt.value = "";
          checkPage();
        })
        .catch((error) => {
          // An error happened.
          alert("Some error please try again");
        });
    }
  } else if (profileContainer.style.display == "flex") {
    whichThing.innerText = "Profile";
    nextWhichThing[0].innerText = "Logout";
    nextWhichThing[0].id = "logoutBtn";
    let logoutBtn = document.getElementById("logoutBtn");

    logoutBtn?.addEventListener("click", logoutFunc);

    function logoutFunc() {
      signOut(auth)
        .then(() => {
          // Sign-out successful.

          BlogAppContainer.style.display = "none";
          profileContainer.style.display = "none";
          container[0].style.display = "flex";
          userNameHtml.innerText = "";
          userPlaceholder.value = "";
          userMindTxt.value = "";
          checkPage();
        })
        .catch((error) => {
          // An error happened.
          alert("Some error please try again");
        });
    }
  }
};

signInPassword.addEventListener("focus", () => {
  signInPassword.style.borderColor = "rgb(98, 94, 94)";
  signInPassword.style.boxShadow = "none";
});

signUpRepeatPassword.addEventListener("focus", () => {
  signUpRepeatPassword.style.borderColor = "rgb(98, 94, 94)";
  signUpRepeatPassword.style.boxShadow = "none";
});

signUpForm.addEventListener("submit", (a) => {
  a.preventDefault();

  if (signUpPassword.value == signUpRepeatPassword.value) {
    createUserWithEmailAndPassword(
      auth,
      signUpEmail.value,
      signUpPassword.value
    )
      .then(async (userCredential) => {
        // Signed up
        userId = userCredential.user.uid;
        BlogAppContainer.style.display = "block";
        container[0].style.display = "none";

        await setDoc(doc(db, "userName", userId), {
          firstname: signUpUserName.value,
          lastname: signUpUserLastName.value,
          userImg: "",
          userEmail: userCredential.user.email,
        });

        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = "";
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);

        BlogAppContainer.style.display = "none";
        container[0].style.display = "flex";

        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = "";
        }
        // ..
      });
  } else {
    signUpRepeatPassword.style.borderColor = "red";
    signUpRepeatPassword.style.boxShadow = "0px 0px 5px red";
    signUpRepeatPassword.value = "";
  }
});

signInForm.addEventListener("submit", (a) => {
  a.preventDefault();

  signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      BlogAppContainer.style.display = "block";
      container[0].style.display = "none";
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
      }

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      signInPassword.value = "";
      signInPassword.style.borderColor = "red";
      signInPassword.style.boxShadow = "0px 0px 5px red";
    });
});

blogForm.addEventListener("submit", async (submitedForm) => {
  submitedForm.preventDefault();

  if (edit == false && add == true) {
    let now = new Date();
    let date = now.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let userObj = await getDoc(doc(db, "userName", userId));

    let { userImg } = userObj.data();

    let obj = {
      placeholder: submitedForm.target[0].value,
      userMind: submitedForm.target[1].value,
      userName: userName,
      engdate: date,
      userId: userId,
      userImage: userImg
        ? userImg
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ69yukxQGBGUPT4o9Y7_v4nNsmgT5FuXbAQQ&usqp=CAU",
    };

    let collectionRef = collection(db, "userBlog");

    let id = await addDoc(collectionRef, obj);

    getBlogs(id);

    submitedForm.target[0].value = "";
    submitedForm.target[1].value = "";
  } else {
    let obj = {
      placeholder: submitedForm.target[0].value,
      userMind: submitedForm.target[1].value,
    };

    let docRef = doc(db, "userBlog", blogId);

    let id = await updateDoc(docRef, obj);

    getBlogs(id);

    submitedForm.target[0].value = "";
    submitedForm.target[1].value = "";
    edit = false;
    add = true;
  submitBtn.innerText = 'Publish Blog';
  }
});

async function getBlogs() {
  divForBlogAdd.innerHTML = null;

  let q = query(collectionRef, where("userId", "==", userId));

  let querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (element) => {
    let { userName, placeholder, userMind, engdate, userImage } =
      element.data();

    let div = `
        <div class="blogCart">
        <div class="txtImgDiv">
        <img class="cartImg" src="${userImage}" alt="user image">
        <div>
        <span class="placeholdertxt">${placeholder}</span>
        <span class="txt"><span class="blogAdderName">${userName}</span> - <span class="blogAddedDate">${engdate}</span></span>
        </div>
        </div>
        <br>
        <span class="userMindTxt">${userMind}</span>
        <br>
        <span id="${element.id}" onClick='deleteBlog(this)' class="deleteTxt">Delete</span>
        <span id="${element.id}" onClick='editBlog(this)' class="editTxt">Edit</span>
        </div>`;

    divForBlogAdd.innerHTML += div;
  });
};

window.deleteBlog = async function (delBtnThis) {
  await deleteDoc(doc(db, "userBlog", delBtnThis.id));
  getBlogs();
};

window.editBlog = async function (editBtnThis) {
  edit = true;
  add = false;
  blogId = editBtnThis.id;

  let userBlog = await getDoc(doc(db, "userBlog", editBtnThis.id));

  userPlaceholder.value = userBlog.data().placeholder;
  userMindTxt.value = userBlog.data().userMind;
  document.documentElement.scrollTop = 0;
  submitBtn.innerText = 'Edit Blog';
};

function profilePage() {
  if (!profileContainer.style.display) {
    blogcontainer.style.display = "none";
    profileContainer.style.display = "flex";
    checkPage();
  } else;
};

async function addImg() {
  let storageRef = ref(storage, `usersImages/${userId}`);

  await uploadBytes(storageRef, imageInput.files[0]).then((snapshot) => {
    getDownloadURL(storageRef).then(async (url) => {
      let obj = {
        userImg: url,
      };

      await updateDoc(doc(db, "userName", userId), obj);

      profileByDefault();

      let ids = query(collectionRef, where("userId", "==", userId));

      let a = await getDocs(ids);

      a.forEach(async (data) => {
        let objj = {
          userImage: url,
        };

        await updateDoc(doc(db, "userBlog", data.id), objj);
      });
    });
  });
};

async function profileEdit() {
  let ids = query(collectionRef, where("userId", "==", userId));
  let a = await getDocs(ids);

  a.forEach(async (data) => {
    let objj = {
      userName: `${userFirtsNameForEdit.value} ${userLastNameForEdit.value}`,
    };
    await updateDoc(doc(db, "userBlog", data.id), objj);
  });

  if (imageInput.files.length != 0) {
    addImg();
  }

  let obj = {
    firstname: userFirtsNameForEdit.value,
    lastname: userLastNameForEdit.value,
  };

  await updateDoc(doc(db, "userName", userId), obj);

  profileByDefault();
  window.location.reload();
};

async function profileByDefault() {
  let userObj = await getDoc(doc(db, "userName", userId));

  let { lastname, firstname, userEmail, userImg } = userObj.data();

  selectedImage.src = userImg
    ? userImg
    : anotherUserImage;
  userFirtsNameForEdit.value = firstname;
  userLastNameForEdit.value = lastname;
  userEmailForEdit.value = userEmail;
};