import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA01-uxzM4S8yB8nS0kxz-y1405JQc9ig",
  authDomain: "fupre-sug.firebaseapp.com",
  projectId: "fupre-sug",
  storageBucket: "fupre-sug.firebasestorage.app",
  messagingSenderId: "517127118062",
  appId: "1:517127118062:web:2cea84f5288a98e35a27ff",
  measurementId: "G-HM4YHH1705"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);