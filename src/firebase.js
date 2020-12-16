// Firebase settings file
import firebase from "firebase/app"; // /app es como el modulo core de firebase
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore(); // Ejecutar métodos de firestore desde la variable
const auth = firebase.auth(); // Ejecutar métodos de fire-Auth desde la variable
export { db, auth }; // Exportar las variables en las que tendremos acceso a ambos servicios
