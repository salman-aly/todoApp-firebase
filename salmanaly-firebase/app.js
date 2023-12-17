import {
  auth,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  db,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  getDocs,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  where
  // deleteDoc,
} from "./firebase.js";

let name = document.getElementById("name");
let email = document.getElementById("email");

let loader = document.querySelector(".loader-spin");
let content = document.querySelector(".content");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(docRef);
    // console.log("doc==>", docSnap.data());

    if (docSnap.data()) {
      if (location.pathname !== "/salmanaly-firebase/index.html") {
        window.location = "/salmanaly-firebase/index.html";
      }
      name.value = docSnap.data().name;
      email.innerHTML = user.email;

      loader.style.display = "none";
      const uid = user.uid;
    }
    // verified by email

    // sendEmailVerification(auth.currentUser).then(() => {
    //   console.log("Email verification sent!");
    // });
  } else {
    console.log("user not login", location.pathname);

    if (
      location.pathname !== "/salmanaly-firebase/signin.html" &&
      location.pathname !== "/salmanaly-firebase/signup.html" &&
      location.pathname !== "/salmanaly-firebase/phone.html"
    ) {
      window.location = "./signin.html";
    }
  }
});

let logoutBtn = document.getElementById("logoutBtn");

let logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
      window.location = "signin.html";
    })
    .catch((error) => {
      console.log("err", error);
    });
};

logoutBtn && logoutBtn.addEventListener("click", logout);

// Phone OTP send

let phone = document.getElementById("phone");
let registerPhone = document.getElementById("registerPhone");
let confirmation;

// window.intlTelInput(phone,{
//   onlyCountries: [
//     "al",
//     "ad",
//     "at",
//     "by",
//     "be",
//     "ba",
//     "bg",
//     "hr",
//     "cz",
//     "dk",
//     "ee",
//     "fo",
//     "fi",
//     "pk",
//     "de",
//     "gi",
//     "gr",
//     "va",
//     "hu",
//     "is",
//     "ie",
//     "it",
//     "lv",
//     "li",
//     "lt",
//     "lu",
//     "mk",
//     "mt",
//     "md",
//     "mc",
//     "me",
//     "nl",
//     "no",
//     "pl",
//     "pt",
//     "ro",
//     "ru",
//     "sm",
//     "rs",
//     "sk",
//     "si",
//     "es",
//     "se",
//     "ch",
//     "ua",
//     "gb",
//   ],
//   utilsScript: "/intl-tel-input/js/utils.js?1701962297307", // just for formatting/placeholders etc
// });

let phoneRegister = () => {
  console.log("chalra hai");

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {}
  );
  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, `+92${phone.value}`, appVerifier)
    .then((confirmationResult) => {
      confirmation = confirmationResult;
      console.log("Sms sent");
    })
    .catch((error) => {
      console.log("Error=====>", error);
    });
};

registerPhone && registerPhone.addEventListener("click", phoneRegister);

// OTP verification
let otpVerify = document.getElementById("otpVerify");

let verify = () => {
  let userOtp = document.getElementById("userOtp");

  confirmation
    .confirm(userOtp.value)
    .then((result) => {
      console.log("User signed in successfully.");
      const user = result.user;
    })
    .catch((error) => {
      console.log("User couldn't sign in (bad verification code?", error);
    });

  console.log(userOtp.value);

  // loader.style.display = "none";
  content.style.display = "block";
};

otpVerify && otpVerify.addEventListener("click", verify);

//update task button
let updateTask = document.getElementById("updateTask");

let taskUpdate = async () => {
  let name = document.getElementById("name");
  let userTask = document.getElementById("userTask");
  console.log(name.value, auth.currentUser.uid);

  const userRef = doc(db, "user", auth.currentUser.uid);

  await updateDoc(userRef, {
    name: name.value,
  });

  console.log("Profile updated");
};

updateTask && updateTask.addEventListener("click", taskUpdate);

// delete task
// let del = document.getElementById("del");

// let taskDelete = async () => {
//   let userTask = document.getElementById("userTask");
//   await deleteDoc(doc(db, "user", "userTask"));
//   console.log("delete task");
// };

// del && del.addEventListener("click", taskDelete);

//get all users from firebase

let getAllUsers = async () => {
  const q = collection(db, "user");

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
  });
};

getAllUsers();

let createTaskBtn = document.getElementById("createTask");

let taskCreate = async () => {
  let userTask = document.getElementById("todo");
  // console.log(userTask.value);

  const docRef = await addDoc(collection(db, "todos"), {
    value: userTask.value,
    timeStamp: serverTimestamp(),
    status: "pending",
  });
  // console.log("Document written with ID: ", docRef.id);
};

createTaskBtn && createTaskBtn.addEventListener("click", taskCreate);

let getAllTodos = async () => {
  const ref = query(
    collection(db, "todos"),
    orderBy("timeStamp", "desc"),
    where("status", "==", "completed")
  );
  let todoList = document.getElementById("todoList");
  const unsubscribe = onSnapshot(ref, (querySnapshot) => {
    todoList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      // console.log("timestamp====>", doc.data());
      todoList.innerHTML += `
        <p class="paragraph">
          ${doc.data().value}
          <a href="#">
            <i class="bx bxs-trash-alt bx-flashing" style="color: #ffffff"></i>
          </a>
        </p>
      `;
    });
  });
};

getAllTodos();
