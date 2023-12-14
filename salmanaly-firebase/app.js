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
} from "./firebase.js";

let name = document.getElementById("name");
let email = document.getElementById("email");

let loader = document.querySelector(".loader-spin");
let content = document.querySelector(".content");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(docRef);
    console.log("doc==>", docSnap.data());
    if (docSnap.data()) {
      if (location.pathname !== "/salmanaly-firebase/index.html") {
        window.location = "/salmanaly-firebase/index.html";
      }
      name.innerHTML = `Welcome ${user.email.slice(
        0,
        user.email.indexOf("@")
      )}`;
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
      location.pathname !== "/salmanaly-firebase/phone.html" &&
      location.pathname !== "/salmanaly-firebase/index.html"
    ) {
      window.location = "/salmanaly-firebase/index.html";
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
  utilsScript: "/intl-tel-input/js/utils.js?1701962297307", // just for formatting/placeholders etc
});

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

  loader.style.display = "none";
  content.style.display = "block";
};

otpVerify && otpVerify.addEventListener("click", verify);
