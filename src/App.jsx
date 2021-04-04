import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // Allows to create routes
import React, { useState } from "react";
// Components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Reset from "./components/Reset";
// Functions
import { auth } from "./firebase"; // Only require auth() method (firebase.auth())
// Wraps dinamic content (all pages) using <Switch/>, Assign path (Url) with <Router/> tag (each page)
function App() {
  const [firebaseUser, setFirebaseUser] = useState(false);
  React.useEffect(() => {
    // .onAuthStateChange evalua una sesión de firebase, tanto si esta logeada o no.
    auth.onAuthStateChanged((user) => {
      console.log("User is: ", user);
      // Si existe un usuario activo, monta en el state la info. del user
      if (user) {
        setFirebaseUser(user);
        console.log("firebaseUser state: ", firebaseUser);
      } else {
        setFirebaseUser(null);
        console.log("firebaseUser state: ", firebaseUser);
      }
    });
  });
  // If active user exists
  return firebaseUser !== false ? (
    <Router>
      <div className="App">
        <Navbar firebaseUser={firebaseUser} />
        {/* Navbar is visible in all routes */}
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/admin">
            <Admin></Admin>
          </Route>
          <Route path="/reset">
            <Reset></Reset>
          </Route>
          <Route path="/">Home component</Route>
        </Switch>
      </div>
    </Router>
  ) : (
    <p> Loading....</p>
  );
}

export default App;
