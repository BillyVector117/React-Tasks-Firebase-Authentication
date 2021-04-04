// Firebase config file
import firebase from "firebase/app"; // Core Firebase module
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
  authDomain: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
  projectId: "fireauth-reactjs",
  storageBucket: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
  messagingSenderId: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
  appId: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore(); // Shorcut database methods
const auth = firebase.auth(); // Shorcut authentication methods
export { db, auth }; // Export shorcuts
