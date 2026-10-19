import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// REPLACE THIS OBJECT WITH THE ONE YOU JUST COPIED
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0l-uxZm4SBy8bNS0kxz-y1405JQc9qIg",
  authDomain: "fupre-sug.firebaseapp.com",
  projectId: "fupre-sug",
  storageBucket: "fupre-sug.firebasestorage.app",
  messagingSenderId: "517127118062",
  appId: "1:517127118062:web:2cea84f5288a98e35a27ff",
  measurementId: "G-HM4YHH1705"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);