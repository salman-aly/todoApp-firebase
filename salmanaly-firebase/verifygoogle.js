import {
  auth,
  GoogleAuthProvider,
  googleProvider,
  signInWithPopup,
  db,
  doc,
  setDoc,
} from "./firebase.js";

let addUserToFirestore = async (user) => {
  const res = await setDoc(doc(db, "user", user.uid), {
    name: user.displayName,
    email: user.email,
    verify: user.emailVerified,
    photo: user.photoURL,
    uid: user.uid,
  });

  console.log("res====>", res);
};

let verifywithgoogle = document.getElementById("verifywithgoogle");

let verifygoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      addUserToFirestore(user);
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
