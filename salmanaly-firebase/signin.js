import { auth, signInWithEmailAndPassword } from "./firebase.js";


//login
let loginBtn = document.getElementById("loginBtn");

let register = () => {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  //   console.log(userName, password);
  
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("user====>", user);
      window.location= "index.html";
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("err====>", errorMessage);
    });
};

loginBtn.addEventListener("click", register);
