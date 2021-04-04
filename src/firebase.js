// Firebase config file
import firebase from "firebase/app"; // Core Firebase module
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-ER4HWbhoY-F_XcOWRytz3W5_EQaA_jU",
  authDomain: "fireauth-reactjs.firebaseapp.com",
  projectId: "fireauth-reactjs",
  storageBucket: "fireauth-reactjs.appspot.com",
  messagingSenderId: "1064521285916",
  appId: "1:1064521285916:web:c48a4c6a56fd5613d3fad9",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore(); // Shorcut database methods
const auth = firebase.auth(); // Shorcut authentication methods
export { db, auth }; // Export shorcuts
