import "./App.css";
// Modulo para usar rutas
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { auth } from "./firebase"; // Require firebase.auth();
// Switch envuelve el contenido dinamico, Route asigna la ruta/path de ese componente dinamico
function App() {
  const [firebaseUser, setFirebaseUser] = useState(false); // El usuario a detectar inicia en false
  React.useEffect(() => {
    // .onAuthStateChange evalua una sesión de firebase, tanto si esta logeada o no.
    auth.onAuthStateChanged((user) => {
      console.log(user);
      // Si existe un usuario activo, monta en el state la info. del user
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });
  });
  // Si el state 'firebase' es distinto de false/null muestra todas las rutas, si no, un loader
  return firebaseUser !== false ? (
    <Router>
      <div className="App">
        <Navbar firebaseUser={firebaseUser}></Navbar>
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/admin">
            <Admin></Admin>
          </Route>
          <Route path="/">Home</Route>
        </Switch>
      </div>
    </Router>
  ) : (
    <p> Loading....</p>
  );
}

export default App;
