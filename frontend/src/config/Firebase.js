import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  deleteUser,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase app with provided configuration
const app = initializeApp(firebaseConfig);
// Set up Google authentication provider
const googleProvider = new GoogleAuthProvider();
// Get the Firebase Auth instance
const auth = getAuth(app);

export {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  deleteUser,
  signOut,
};
