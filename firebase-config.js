// Replace with your Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzZ5tZtLRf2p8UZVyUHxsh6R53Xv5lzZg",
  authDomain: "examresultsystem.firebaseapp.com",
  projectId: "examresultsystem",
  storageBucket: "examresultsystem.firebasestorage.app",
  messagingSenderId: "947635303369",
  appId: "1:947635303369:web:456ddb7e607f5f2a39ee18"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
