// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy5Sk3VuHWfD4RRT9pE-EL5W4mGjg0SX0",
  authDomain: "pwa-recomendador-de-libros.firebaseapp.com",
  projectId: "pwa-recomendador-de-libros",
  storageBucket: "pwa-recomendador-de-libros.firebasestorage.app",
  messagingSenderId: "1045433464297",
  appId: "1:1045433464297:web:71e5029bf731a52f2d8778",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
