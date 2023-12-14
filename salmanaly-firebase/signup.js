//signup

import { auth, createUserWithEmailAndPassword } from "./firebase.js";

let signBtn = document.getElementById("signBtn");

let signUp = () => {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  //   console.log(userName, password);

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("user====>", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("err====>", errorMessage);
    });
};

signBtn.addEventListener("click", signUp);
