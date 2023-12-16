import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  getFirestore,
  updateDoc,
  addDoc,
  getDocs,
  collection,
  onSnapshot,
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr6M10eADx0CFCtjjjPXq45DKgMC8cJIs",
  authDomain: "salmanaly-firebase.firebaseapp.com",
  projectId: "salmanaly-firebase",
  storageBucket: "salmanaly-firebase.appspot.com",
  messagingSenderId: "599068306848",
  appId: "1:599068306848:web:bd5ed577166260cfffc8c5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  googleProvider,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  getDocs,
  collection,
  onSnapshot,
  deleteDoc 
};
