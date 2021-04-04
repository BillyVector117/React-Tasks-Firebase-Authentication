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
    // .onAuthStateChange checks for existing user (logged/unregistered)
    auth.onAuthStateChanged((user) => {
      console.log("User is: ", user);
      // Set at 'firebaseUser' current user (ONLY IF Firebase finds one)
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
          <Route path="/billy">
            Copyright © Billy Rodríguez Morales 2021 -
            <a href="https://github.com/BillyVector117">Github</a>
            <hr/>
            Thanks Bluuweb!
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
