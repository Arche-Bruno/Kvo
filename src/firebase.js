// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  onChildAdded,
  onChildRemoved,
  off,
  remove,
  onChildChanged,
  get,
  runTransaction,
  query,
  orderByChild,
  equalTo,
  update,
} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFy1j8N26_w5dHC6kG9oP7RTjhtNqDnMM",
  authDomain: "kvoo-4ce98.firebaseapp.com",
  projectId: "kvoo-4ce98",
  storageBucket: "kvoo-4ce98.appspot.com",
  messagingSenderId: "134355588069",
  appId: "1:134355588069:web:081644ebbc9ae23946550c",
  measurementId: "G-VJEQJGMX07",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
export const database = getDatabase();

export {
  ref,
  onValue,
  set,
  push,
  onChildAdded,
  onChildRemoved,
  off,
  remove,
  onChildChanged,
  get,
  runTransaction,
  query,
  orderByChild,
  equalTo,
  update,
};
