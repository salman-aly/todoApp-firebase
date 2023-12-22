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
  where,
  deleteDoc,
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
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: "Signed out successfully",
  });
  setTimeout(() => {
    signOut(auth)
      .then(() => {
        // console.log("Sign-out successful.");
        window.location = "signin.html";
      })
      .catch((error) => {
        console.log("err", error);
      });
  }, 2000);
};

logoutBtn && logoutBtn.addEventListener("click", logout);

//get all users from firebase

let getAllUsers = async () => {
  const q = collection(db, "user");

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
  });
};

getAllUsers();

//send data to firestore
let input = document.getElementById("input");
let list_item = document.getElementById("list_item");

// Show data in UI
const addItem = () => {
  if (input.value.trim() !== "") {
    if (input.value.length < 20) {
      addEventListeners();
      addData();
    } else {
      alert("value should be lower 15 leter");
    }
  } else {
    alert("Can't add an empty value");
  }
  input.value = "";
};

const addItem_btn = document.getElementById("addItem_btn");
addItem_btn.addEventListener("click", addItem);

//Sending data to firestore
const addData = async () => {
  const docRef = await addDoc(collection(db, "todos"), {
    value: input.value,
    timestamp: serverTimestamp(),
  });
};

//Button event listener
const addEventListeners = () => {
  let editButtons = document.querySelectorAll(".edit_btn");
  let deleteButtons = document.querySelectorAll(".del_btn");

  editButtons.forEach((button, i) => {
    button.addEventListener("click", () => {
      editItem(i);
    });
  });

  deleteButtons.forEach((button, i) => {
    button.addEventListener("click", () => {
      deleteItem(i);
    });
  });
};
addEventListeners();
//Edit Button
const editItem = async (index) => {
  let newValue = prompt("Enter new value:");

  if (newValue !== null) {
    if (newValue.length < 15) {
      
      // Update Firestore data
      const ref = query(collection(db, "todos"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(ref);
      const documents = querySnapshot.docs;
      const docId = documents[index].id;

      await updateDoc(doc(db, "todos", docId), {
        value: newValue,
        timestamp: serverTimestamp(),
      });

      // Update UI
      let paragraphs = document.querySelectorAll(".para");
      paragraphs[index].textContent = newValue;
    } else {
      alert("Value should be less than 15 characters");
    }
  }
};
//Delete button
const deleteItem = async (index) => {
  const ref = query(collection(db, "todos"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(ref);
  const documents = querySnapshot.docs;
  const docId = documents[index].id;

  //sweet altert
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: "Task Removed",
  });
  await deleteDoc(doc(db, "todos", docId));
};

//Getting data from FireStore & Display
const getData = async () => {
  const ref = query(collection(db, "todos"), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(ref, (querySnapshot) => {
    list_item.innerHTML = "";
    querySnapshot.forEach((doc) => {
      list_item.innerHTML += `
        <div class="list_item">
          <div>
            <p class="para">${doc.data().value}</p>
          </div>
          <div class="flexBtn">
            <button class="edit_btn">
            <i class='bx bxs-edit-alt' style='color:#060606'></i>
            </button>
            <button class="del_btn">
            <i class='bx bxs-message-square-x'></i>
            </button>
          </div>
        </div>
      `;
    });
    addEventListeners();
  });
};
getData();

// Phone OTP send

let phone = document.getElementById("phone");
let registerPhone = document.getElementById("registerPhone");
let confirmation;

let iti = () =>
  window.intlTelInput(phone, {
    onlyCountries: [
      "al",
      "ad",
      "at",
      "by",
      "be",
      "ba",
      "bg",
      "hr",
      "cz",
      "dk",
      "ee",
      "fo",
      "fi",
      "pk",
      "de",
      "gi",
      "gr",
      "va",
      "hu",
      "is",
      "ie",
      "it",
      "lv",
      "li",
      "lt",
      "lu",
      "mk",
      "mt",
      "md",
      "mc",
      "me",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "ru",
      "sm",
      "rs",
      "sk",
      "si",
      "es",
      "se",
      "ch",
      "ua",
      "gb",
    ],
    utilsScript: "/intl-tel-input/js/utils.js?1701962297307",
  });

let phoneRegister = () => {
  // console.log("chalra hai");

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

  loader.style.display = "none";
  content.style.display = "block";
};

otpVerify && otpVerify.addEventListener("click", verify);
