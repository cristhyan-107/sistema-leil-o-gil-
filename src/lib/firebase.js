// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj_GZzOFIG_lE9gIAMW-eo5dm929VG8d8",
  authDomain: "leilaoagil-21c5f.firebaseapp.com",
  projectId: "leilaoagil-21c5f",
  storageBucket: "leilaoagil-21c5f.firebasestorage.app",
  messagingSenderId: "902564151870",
  appId: "1:902564151870:web:ed539639e925fb64ce076f",
  measurementId: "G-B25J2H26PD"
};

// Initialize Firebase
// Use getApps() to prevent re-initialization errors in Next.js hot reloading
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
