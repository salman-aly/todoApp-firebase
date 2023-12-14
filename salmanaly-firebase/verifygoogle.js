import {
  auth,
  GoogleAuthProvider,
  googleProvider,
  signInWithPopup,
} from "./firebase.js";

let verifywithgoogle = document.getElementById("verifywithgoogle");

let verifygoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log("user===>", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log("err===>", errorMessage);
    });
};

verifywithgoogle.addEventListener("click", verifygoogle);
