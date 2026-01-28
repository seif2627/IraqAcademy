import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAO5EE_vbC1PKTmLCGpErJZDj3rstEO1Mo",
  authDomain: "iraqacademy-3479c.firebaseapp.com",
  projectId: "iraqacademy-3479c",
  storageBucket: "iraqacademy-3479c.firebasestorage.app",
  messagingSenderId: "632989275530",
  appId: "1:632989275530:web:9f378db6112d19d341e473",
  measurementId: "G-FDBY1TFT4L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

window.firebaseAuth = {
  auth,
  googleProvider,
  microsoftProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
};
